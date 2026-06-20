import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ThemeContext = createContext();

export function ThemeProvider({ children, user, setUser }) {
  // 1. Initialize strictly from localStorage OR default to 'system'
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('shoplink_theme') || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  // 2. The Master DOM Controller
  const applyThemeToDOM = (activeTheme) => {
    const root = document.documentElement;
    const isDark = activeTheme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : activeTheme === 'dark';

    setResolvedTheme(isDark ? 'dark' : 'light');

    // Strip everything and force the correct class
    root.classList.remove('light', 'dark');
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.style.colorScheme = 'light';
    }
  };

  // 3. Lock in changes anytime `theme` state updates
  useEffect(() => {
    localStorage.setItem('shoplink_theme', theme);
    applyThemeToDOM(theme);
  }, [theme]);

  // 4. System Listener - ONLY obeys the OS if 'system' is actively selected
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyThemeToDOM('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 5. Supabase Sync - Load from DB on mount
  useEffect(() => {
    if (user?.vendor?.theme && user.vendor.theme !== theme) {
      setThemeState(user.vendor.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.vendor?.id]);

  // 6. The master update function triggered by your buttons
  const handleSetTheme = async (newTheme) => {
    setThemeState(newTheme); // Instant UI update
    
    if (user?.vendor?.id) {
      try {
        await supabase
          .from('vendors')
          .update({ theme: newTheme })
          .eq('id', user.vendor.id);
      } catch (err) {
        console.error('Theme save error:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);