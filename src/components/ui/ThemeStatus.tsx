import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useThemeStore } from '@/store/theme-store';
import { useLanguageStore } from '@/store/language-store';

export function ThemeStatus() {
  const { theme, isDark } = useThemeStore();
  const { t } = useLanguageStore();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '🖥️';
      default: return '🎨';
    }
  };

  return (
    <Badge 
      variant={isDark ? "secondary" : "outline"}
      className="theme-status-badge transition-all duration-300 hover:scale-105"
    >
      <span className="mr-1">{getThemeIcon()}</span>
      {t(`theme.${theme}`)}
    </Badge>
  );
}

export default ThemeStatus;