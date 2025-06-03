import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const prefersLightMQ = '(prefers-color-scheme: light)';

const getInitialTheme = (): Theme => {
  if (typeof window !== 'object') {
    // Default for SSR or non-browser environments, can be overridden
    return 'dark';
  }
  // For now, we won't implement localStorage persistence to keep it focused.
  // We'll just use the media query.
  return window.matchMedia(prefersLightMQ).matches ? 'light' : 'dark';
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);

    // Persist theme choice (e.g., to localStorage) - SKELETON
    // For now, we are not implementing localStorage to keep this step focused.
    // try {
    //   localStorage.setItem('app-theme', theme);
    // } catch (e) {
    //   console.warn('Could not save theme to localStorage:', e);
    // }
  }, [theme]);

  // Listen to system theme changes if no explicit theme is set by user
  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ);

    const handleChange = () => {
      // This effect should ideally only run if the user hasn't actively chosen a theme.
      // For simplicity in this step, we'll always update if system changes.
      // A more robust solution would check if a theme was explicitly set by the user.
      setThemeState(mediaQuery.matches ? 'light' : 'dark');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// NonFlashOfWrongThemeEls - inspired by jsonhero-web
// This script tries to set the theme ASAP to avoid flash of unstyled content or wrong theme.
// It assumes 'dark' as default if nothing else is set.
// This should be placed in the <head> of your HTML ideally.
const clientThemeCode = `
  ;(function() {
    function getInitialTheme() {
      // Basic localStorage check - can be expanded
      // try {
      //   const persistedColorPreference = window.localStorage.getItem('app-theme');
      //   if (typeof persistedColorPreference === 'string') {
      //     return persistedColorPreference;
      //   }
      // } catch (e) {
      //   // ignore
      // }
      const mql = window.matchMedia('(prefers-color-scheme: light)');
      return mql.matches ? 'light' : 'dark';
    }
    const theme = getInitialTheme();
    const cl = document.documentElement.classList;
    if (!cl.contains(theme)) { // check if class is already set
        cl.remove(theme === 'light' ? 'dark' : 'light'); // remove opposite
        cl.add(theme);
    }
  })();
`;

export function NonFlashOfWrongThemeScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
  );
}
