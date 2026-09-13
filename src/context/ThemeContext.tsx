import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'cream' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('wallcraft_theme_palette') as Theme | null;
      if (savedTheme === 'cream' || savedTheme === 'dark') {
        return savedTheme;
      }
    }
    // Default to the requested luxury Creamy Beige theme
    return 'cream';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('theme-cream');
      document.body.style.backgroundColor = '#161412';
      document.body.style.color = '#f5f2eb';
    } else {
      root.classList.remove('dark');
      root.classList.add('theme-cream');
      document.body.style.backgroundColor = '#fbf9f4';
      document.body.style.color = '#25211c';
    }
    try {
      localStorage.setItem('wallcraft_theme_palette', theme);
    } catch {
      // Ignore storage errors in restricted iframe
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'cream' ? 'dark' : 'cream'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
