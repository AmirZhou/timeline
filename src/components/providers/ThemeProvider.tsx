import React, { createContext, useContext } from 'react';

interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
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
};

const ThemeContext = createContext<ThemeColors>(darkTheme);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={darkTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
