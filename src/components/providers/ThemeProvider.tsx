import React, { createContext, useContext, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  glass: {
    background: string;
    border: string;
  };
}

const darkTheme: ThemeColors = {
  background: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  accent: '#00ff00',
  success: '#00ff00',
  warning: '#ffa500',
  error: '#ff4444',
  border: '#333333',
  glass: {
    background: 'rgba(0, 0, 0, 0.2)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
};

const lightTheme: ThemeColors = {
  background: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  accent: '#1d4ed8',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  border: '#cbd5e1',
  glass: {
    background: 'rgba(248, 250, 252, 0.60)',
    border: 'rgba(71, 85, 105, 0.25)',
  },
};

interface ThemeContextType extends ThemeColors {
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType>({
  ...darkTheme,
  mode: 'dark',
});

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = 'dark' 
}) => {
  const colors = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    // Inject theme CSS variables
    const root = document.documentElement;
    root.style.setProperty('--timeline-bg', colors.background);
    root.style.setProperty('--timeline-text', colors.text);
    root.style.setProperty('--timeline-text-secondary', colors.textSecondary);
    root.style.setProperty('--timeline-accent', colors.accent);
    root.style.setProperty('--timeline-success', colors.success);
    root.style.setProperty('--timeline-warning', colors.warning);
    root.style.setProperty('--timeline-error', colors.error);
    root.style.setProperty('--timeline-border', colors.border);
    root.style.setProperty('--timeline-glass-bg', colors.glass.background);
    root.style.setProperty('--timeline-glass-border', colors.glass.border);
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ ...colors, mode: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
