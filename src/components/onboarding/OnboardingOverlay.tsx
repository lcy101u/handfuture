import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, SkipForward, Play, Pause, RotateCcw } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useLanguageStore } from '@/store/language-store';
import { useAnalyticsStore } from '@/store/analytics-store';

export const OnboardingOverlay: React.FC = () => {
  const {
    isActive,
    currentStep,
    steps,
    userPreferences,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding
  } = useOnboardingStore();
  
  const { t } = useLanguageStore();
  const { trackEvent } = useAnalyticsStore();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (!isActive || !currentStepData?.target) return;

    const findTarget = () => {
      const element = document.querySelector(currentStepData.target!) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Calculate position for tooltip
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let top = rect.top + scrollTop;
        let left = rect.left + scrollLeft;

        switch (currentStepData.position) {
          case 'top':
            top = rect.top + scrollTop - 20;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + scrollTop + 20;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.left + scrollLeft - 20;
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.right + scrollLeft + 20;
            break;
        }

        setOverlayPosition({ top, left });
        
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: userPreferences.skipAnimations ? 'auto' : 'smooth',
          block: 'center' 
        });
        
        // Add highlight class
        element.classList.add('onboarding-highlight');
        return element;
      }
      return null;
    };

    const element = findTarget();
    
    // Retry after a short delay if element not found
    if (!element) {
      const timeout = setTimeout(findTarget, 500);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (element) {
        element.classList.remove('onboarding-highlight');
      }
    };
  }, [isActive, currentStep, currentStepData, userPreferences.skipAnimations]);

  useEffect(() => {
    if (isAutoPlaying && userPreferences.autoAdvance) {
      const timer = setTimeout(() => {
        nextStep();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying, currentStep, userPreferences.autoAdvance, nextStep]);

  const handleNext = () => {
    trackEvent('onboarding_step_completed', {
      step: currentStepData.id,
      stepNumber: currentStep + 1,
      totalSteps: steps.length
    });
    nextStep();
  };

  const handlePrevious = () => {
    trackEvent('onboarding_step_back', {
      fromStep: currentStepData.id,
      stepNumber: currentStep + 1
    });
    previousStep();
  };

  const handleSkip = () => {
    trackEvent('onboarding_skipped', {
      atStep: currentStepData.id,
      stepNumber: currentStep + 1,
      totalSteps: steps.length
    });
    skipOnboarding();
  };

  const handleComplete = () => {
    trackEvent('onboarding_completed', {
      totalSteps: steps.length,
      completedAt: new Date().toISOString()
    });
    completeOnboarding();
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    trackEvent('onboarding_autoplay_toggled', {
      enabled: !isAutoPlaying,
      atStep: currentStepData.id
    });
  };

  if (!isActive) return null;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 onboarding-overlay" />
      
      {/* Spotlight effect */}
      {targetElement && (
        <div 
          className="fixed z-45 pointer-events-none onboarding-spotlight"
          style={{
            top: overlayPosition.top - 10,
            left: overlayPosition.left - 10,
            width: targetElement.offsetWidth + 20,
            height: targetElement.offsetHeight + 20,
          }}
        />
      )}

      {/* Onboarding card */}
      <Card className="fixed z-50 w-80 max-w-[90vw] onboarding-card animate-in slide-in-from-bottom-4 duration-300" 
            style={{
              top: Math.min(overlayPosition.top + 60, window.innerHeight - 400),
              left: Math.min(Math.max(overlayPosition.left - 160, 20), window.innerWidth - 340),
            }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {t('onboarding.step')} {currentStep + 1} {t('onboarding.of')} {steps.length}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAutoPlay}
                className="h-8 w-8 p-0"
              >
                {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <CardTitle className="text-lg leading-tight">
            {t(`onboarding.steps.${currentStepData.id}.title`) || currentStepData.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="text-sm leading-relaxed mb-4">
            {t(`onboarding.steps.${currentStepData.id}.description`) || currentStepData.description}
          </CardDescription>
          
          {/* Component-specific demonstrations */}
          {currentStepData.component === 'theme' && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-2">
                {t('onboarding.try_now')}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-background border" />
                <span className="text-xs">{t('theme.light')}</span>
                <div className="w-4 h-4 rounded bg-foreground" />
                <span className="text-xs">{t('theme.dark')}</span>
              </div>
            </div>
          )}
          
          {currentStepData.component === 'filters' && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-2">
                {t('onboarding.available_filters')}
              </p>
              <div className="flex flex-wrap gap-1">
                {['Natural', 'Enhanced', 'Dramatic', 'Vintage'].map((filter) => (
                  <Badge key={filter} variant="outline" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('onboarding.previous')}
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                size="sm"
                className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {t('onboarding.complete')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                size="sm"
                className="flex items-center gap-1"
              >
                {t('onboarding.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-center mt-3 gap-4 text-xs text-muted-foreground">
            <button
              onClick={handleSkip}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <SkipForward className="h-3 w-3" />
              {t('onboarding.skip_tour')}
            </button>
            <button
              onClick={toggleAutoPlay}
              className="hover:text-foreground transition-colors"
            >
              {isAutoPlaying ? t('onboarding.pause_auto') : t('onboarding.auto_advance')}
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};