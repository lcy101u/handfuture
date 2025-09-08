import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyTheme = (theme: Theme): boolean => {
  let isDark: boolean;
  
  if (theme === 'system') {
    isDark = getSystemTheme();
  } else {
    isDark = theme === 'dark';
  }
  
  // Apply theme to document
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  return isDark;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      
      setTheme: (theme: Theme) => {
        const isDark = applyTheme(theme);
        set({ theme, isDark });
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'palm-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme immediately on hydration
          const isDark = applyTheme(state.theme);
          state.isDark = isDark;
          
          // Listen for system theme changes
          if (state.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
              if (state.theme === 'system') {
                const isDark = e.matches;
                document.documentElement.classList.toggle('dark', isDark);
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                state.isDark = isDark;
              }
            };
            mediaQuery.addEventListener('change', handleChange);
          }
        }
      },
    }
  )
);

// Initialize theme on first load
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  applyTheme(store.theme);
}