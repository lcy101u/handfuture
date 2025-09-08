import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeStore, Theme } from '@/store/theme-store';
import { useLanguageStore } from '@/store/language-store';
import { useAnalyticsStore } from '@/store/analytics-store';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const { t } = useLanguageStore();
  const { trackEvent } = useAnalyticsStore();

  const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun className="h-4 w-4" />, label: t('theme.light') },
    { value: 'dark', icon: <Moon className="h-4 w-4" />, label: t('theme.dark') },
    { value: 'system', icon: <Monitor className="h-4 w-4" />, label: t('theme.system') },
  ];

  const currentThemeOption = themeOptions.find(option => option.value === theme);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    trackEvent('theme_changed', {
      from: theme,
      to: newTheme,
      timestamp: new Date().toISOString()
    });
    
    // Add visual feedback
    document.body.classList.add('theme-switching');
    setTimeout(() => {
      document.body.classList.remove('theme-switching');
    }, 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="theme-toggle-btn relative overflow-hidden transition-all duration-300 hover:scale-110 hover:rotate-12"
        >
          <div className="theme-icon-container">
            {currentThemeOption?.icon}
          </div>
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="theme-dropdown animate-in slide-in-from-top-2 duration-200"
      >
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            className={`theme-option cursor-pointer transition-all duration-200 ${
              theme === option.value 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="theme-option-icon">{option.icon}</span>
              <span>{option.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}