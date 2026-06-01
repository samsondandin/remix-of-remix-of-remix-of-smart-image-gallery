import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'sg_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return (raw as Theme) || 'system';
    } catch (err) {
      return 'system';
    }
  });

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark'); else root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      // ignore
    }
  }, [theme, applyTheme]);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => {
      // If user selected system, respond to changes
      try {
        const raw = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (!raw || raw === 'system') {
          applyTheme('system');
        }
      } catch (err) {}
    };

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [applyTheme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const setThemeAndPersist = useCallback((t: Theme) => {
    setTheme(t);
  }, []);

  return { theme, setTheme: setThemeAndPersist, toggle } as const;
}

export default useTheme;
