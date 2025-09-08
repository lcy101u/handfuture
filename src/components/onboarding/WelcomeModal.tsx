import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Palette, Camera, Filter, BarChart3, Users, Zap, Moon, Sun } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useLanguageStore } from '@/store/language-store';
import { useThemeStore } from '@/store/theme-store';
import { useAnalyticsStore } from '@/store/analytics-store';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onOpenChange }) => {
  const { 
    startOnboarding, 
    skipOnboarding, 
    userPreferences, 
    setUserPreferences 
  } = useOnboardingStore();
  const { t, currentLanguage, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  const { trackEvent } = useAnalyticsStore();
  
  const [selectedPreferences, setSelectedPreferences] = useState(userPreferences);

  const features = [
    {
      icon: <Camera className="h-5 w-5" />,
      title: t('onboarding.features.palm_analysis'),
      description: t('onboarding.features.palm_analysis_desc'),
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      icon: <Filter className="h-5 w-5" />,
      title: t('onboarding.features.image_filters'),
      description: t('onboarding.features.image_filters_desc'),
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: t('onboarding.features.batch_processing'),
      description: t('onboarding.features.batch_processing_desc'),
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: t('onboarding.features.themes'),
      description: t('onboarding.features.themes_desc'),
      color: 'bg-green-500/10 text-green-600 dark:text-green-400'
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: t('onboarding.features.analytics'),
      description: t('onboarding.features.analytics_desc'),
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: t('onboarding.features.social_sharing'),
      description: t('onboarding.features.social_sharing_desc'),
      color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
    }
  ];

  const handleStartTour = () => {
    setUserPreferences(selectedPreferences);
    trackEvent('onboarding_started', {
      language: currentLanguage,
      theme: theme,
      preferences: selectedPreferences
    });
    startOnboarding();
    onOpenChange(false);
  };

  const handleSkipTour = () => {
    setUserPreferences(selectedPreferences);
    trackEvent('onboarding_welcome_skipped', {
      language: currentLanguage,
      theme: theme
    });
    skipOnboarding();
    onOpenChange(false);
  };

  const handleQuickSetup = (setupType: 'beginner' | 'advanced' | 'minimal') => {
    let newPrefs = { ...selectedPreferences };
    
    switch (setupType) {
      case 'beginner':
        newPrefs = {
          skipAnimations: false,
          autoAdvance: true,
          showHints: true
        };
        break;
      case 'advanced':
        newPrefs = {
          skipAnimations: false,
          autoAdvance: false,
          showHints: true
        };
        break;
      case 'minimal':
        newPrefs = {
          skipAnimations: true,
          autoAdvance: true,
          showHints: false
        };
        break;
    }
    
    setSelectedPreferences(newPrefs);
    trackEvent('onboarding_quick_setup', { setupType });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
            {t('onboarding.welcome.title')}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground max-w-2xl mx-auto">
            {t('onboarding.welcome.description')}
          </DialogDescription>
        </DialogHeader>

        {/* Quick Setup Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6">
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/20"
            onClick={() => handleQuickSetup('beginner')}
          >
            <CardContent className="p-4 text-center">
              <Badge variant="secondary" className="mb-2">
                {t('onboarding.setup.beginner')}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {t('onboarding.setup.beginner_desc')}
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/20"
            onClick={() => handleQuickSetup('advanced')}
          >
            <CardContent className="p-4 text-center">
              <Badge variant="default" className="mb-2">
                {t('onboarding.setup.advanced')}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {t('onboarding.setup.advanced_desc')}
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/20"
            onClick={() => handleQuickSetup('minimal')}
          >
            <CardContent className="p-4 text-center">
              <Badge variant="outline" className="mb-2">
                {t('onboarding.setup.minimal')}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {t('onboarding.setup.minimal_desc')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg mb-3 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-sm mb-2">{feature.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customization Options */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {t('onboarding.customize_experience')}
            </h4>
            
            <div className="space-y-4">
              {/* Language Selection */}
              <div className="flex items-center justify-between">
                <Label className="flex flex-col gap-1">
                  <span className="font-medium">{t('onboarding.language')}</span>
                  <span className="text-xs text-muted-foreground">
                    {t('onboarding.language_desc')}
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={currentLanguage === 'zh' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('zh')}
                  >
                    中文
                  </Button>
                  <Button
                    variant={currentLanguage === 'en' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                  >
                    EN
                  </Button>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="flex items-center justify-between">
                <Label className="flex flex-col gap-1">
                  <span className="font-medium">{t('onboarding.theme')}</span>
                  <span className="text-xs text-muted-foreground">
                    {t('onboarding.theme_desc')}
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex items-center gap-1"
                  >
                    <Sun className="h-3 w-3" />
                    {t('theme.light')}
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex items-center gap-1"
                  >
                    <Moon className="h-3 w-3" />
                    {t('theme.dark')}
                  </Button>
                </div>
              </div>

              {/* Tour Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoAdvance"
                    checked={selectedPreferences.autoAdvance}
                    onCheckedChange={(checked) =>
                      setSelectedPreferences(prev => ({ ...prev, autoAdvance: checked }))
                    }
                  />
                  <Label htmlFor="autoAdvance" className="text-sm">
                    {t('onboarding.auto_advance')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showHints"
                    checked={selectedPreferences.showHints}
                    onCheckedChange={(checked) =>
                      setSelectedPreferences(prev => ({ ...prev, showHints: checked }))
                    }
                  />
                  <Label htmlFor="showHints" className="text-sm">
                    {t('onboarding.show_hints')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="skipAnimations"
                    checked={selectedPreferences.skipAnimations}
                    onCheckedChange={(checked) =>
                      setSelectedPreferences(prev => ({ ...prev, skipAnimations: checked }))
                    }
                  />
                  <Label htmlFor="skipAnimations" className="text-sm">
                    {t('onboarding.skip_animations')}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            onClick={handleStartTour}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {t('onboarding.start_tour')}
          </Button>
          
          <Button
            onClick={handleSkipTour}
            variant="outline"
            size="lg"
            className="px-8"
          >
            {t('onboarding.skip_explore')}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          {t('onboarding.welcome.footer')}
        </p>
      </DialogContent>
    </Dialog>
  );
};