import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface HeaderSubtitleProps {
  subtitle?: string;
}

export const HeaderSubtitle: React.FC<HeaderSubtitleProps> = ({ subtitle = "ACCESS ALBERTA LEGAL SERVICES" }) => {
  const theme = useTheme();
  
  return (
    <p 
      style={{ 
        color: theme.accent,
        fontSize: '0.9rem',
        textAlign: 'center',
        margin: '0.5rem 0 0 0',
        letterSpacing: '0.05em',
      }}
    >
      {subtitle}
    </p>
  );
};
