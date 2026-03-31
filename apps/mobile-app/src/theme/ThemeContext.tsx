import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { darkPalette, lightPalette, type AppPalette } from '@/theme/palette';

export type AppTheme = {
  colors: AppPalette;
  isDark: boolean;
  navigationTheme: NavigationTheme;
};

const ThemeContext = createContext<AppTheme | null>(null);

function buildNavigationTheme(
  colors: AppPalette,
  isDark: boolean,
): NavigationTheme {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.bg,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? darkPalette : lightPalette;

  const value = useMemo<AppTheme>(() => {
    const navigationTheme = buildNavigationTheme(colors, isDark);
    return { colors, isDark, navigationTheme };
  }, [colors, isDark]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

/** For rare cases outside the provider (e.g. tests): light palette fallback */
export function useThemeOptional(): AppTheme {
  const ctx = useContext(ThemeContext);
  return (
    ctx ?? {
      colors: lightPalette,
      isDark: false,
      navigationTheme: buildNavigationTheme(lightPalette, false),
    }
  );
}
