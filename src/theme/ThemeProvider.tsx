import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, type Theme, type ThemeName } from '../../tokens/themes';

/**
 * Aurum ThemeProvider
 *
 * Wraps styled-components' provider and adds a runtime mode toggle. Components
 * read `theme.*` via styled() as usual; if they need to *change* the mode they
 * call `useThemeMode()`.
 *
 *     <ThemeProvider initialMode="dark">
 *       <App />
 *     </ThemeProvider>
 */

type ThemeModeContextValue = {
  mode: ThemeName;
  setMode: (mode: ThemeName) => void;
  toggle: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export interface ThemeProviderProps {
  initialMode?: ThemeName;
  /** Force a fixed mode and disable toggling (e.g. forced dark on a kiosk). */
  forceMode?: ThemeName;
  children: React.ReactNode;
}

export function ThemeProvider({ initialMode = 'dark', forceMode, children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeName>(forceMode ?? initialMode);

  const effectiveMode: ThemeName = forceMode ?? mode;
  const theme: Theme = effectiveMode === 'dark' ? darkTheme : lightTheme;

  const toggle = useCallback(() => {
    if (forceMode) return;
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, [forceMode]);

  const ctx = useMemo<ThemeModeContextValue>(
    () => ({ mode: effectiveMode, setMode, toggle }),
    [effectiveMode, toggle],
  );

  return (
    <ThemeModeContext.Provider value={ctx}>
      <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used inside <ThemeProvider>');
  }
  return ctx;
}
