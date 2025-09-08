import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'scroll' | 'wait';
  component?: 'theme' | 'upload' | 'filters' | 'batch' | 'analytics';
}

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  steps: OnboardingStep[];
  hasCompletedOnboarding: boolean;
  showWelcome: boolean;
  userPreferences: {
    skipAnimations: boolean;
    autoAdvance: boolean;
    showHints: boolean;
  };
  
  // Actions
  startOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setUserPreferences: (prefs: Partial<OnboardingState['userPreferences']>) => void;
  showWelcomeModal: () => void;
  hideWelcomeModal: () => void;
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AI Palm Reading',
    description: 'Discover the ancient art of palmistry with modern AI technology. Let us guide you through the features.',
    component: 'upload'
  },
  {
    id: 'theme-intro',
    title: 'Choose Your Perfect Theme',
    description: 'Switch between light and dark modes, or let the app follow your system preferences automatically.',
    target: '[data-onboarding="theme-toggle"]',
    position: 'bottom',
    component: 'theme'
  },
  {
    id: 'upload-photo',
    title: 'Upload Your Hand Photo',
    description: 'Take a clear photo of your palm or upload from your gallery. Good lighting ensures better analysis.',
    target: '[data-onboarding="image-uploader"]',
    position: 'top',
    component: 'upload'
  },
  {
    id: 'image-filters',
    title: 'Enhance Your Image',
    description: 'Use professional filters to improve image quality. Try presets or adjust manually for the best results.',
    target: '[data-onboarding="filter-button"]',
    position: 'left',
    component: 'filters'
  },
  {
    id: 'palm-analysis',
    title: 'Get Your Reading',
    description: 'Our AI analyzes your palm lines and provides insights about emotion, intelligence, career, and energy.',
    target: '[data-onboarding="analysis-section"]',
    position: 'top'
  },
  {
    id: 'batch-processing',
    title: 'Process Multiple Images',
    description: 'Use batch processing to analyze several hand photos at once with consistent filter settings.',
    target: '[data-onboarding="batch-link"]',
    position: 'top',
    component: 'batch'
  },
  {
    id: 'social-sharing',
    title: 'Share Your Results',
    description: 'Share your palm reading results on social media or download them for later reference.',
    target: '[data-onboarding="social-share"]',
    position: 'top'
  },
  {
    id: 'analytics-dashboard',
    title: 'Track Your Journey',
    description: 'Access detailed analytics by clicking the logo 5 times to see your usage patterns and insights.',
    target: '[data-onboarding="logo"]',
    position: 'bottom',
    component: 'analytics'
  }
];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 0,
      steps: defaultSteps,
      hasCompletedOnboarding: false,
      showWelcome: false,
      userPreferences: {
        skipAnimations: false,
        autoAdvance: false,
        showHints: true
      },

      startOnboarding: () => {
        set({
          isActive: true,
          currentStep: 0,
          showWelcome: false
        });
      },

      nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          get().completeOnboarding();
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      skipOnboarding: () => {
        set({
          isActive: false,
          hasCompletedOnboarding: true,
          showWelcome: false
        });
      },

      completeOnboarding: () => {
        set({
          isActive: false,
          hasCompletedOnboarding: true,
          currentStep: 0,
          showWelcome: false
        });
      },

      resetOnboarding: () => {
        set({
          isActive: false,
          currentStep: 0,
          hasCompletedOnboarding: false,
          showWelcome: true,
          userPreferences: {
            skipAnimations: false,
            autoAdvance: false,
            showHints: true
          }
        });
      },

      setUserPreferences: (prefs) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...prefs }
        }));
      },

      showWelcomeModal: () => {
        set({ showWelcome: true });
      },

      hideWelcomeModal: () => {
        set({ showWelcome: false });
      }
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        userPreferences: state.userPreferences
      })
    }
  )
);