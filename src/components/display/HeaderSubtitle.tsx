import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

export const HeaderSubtitle: React.FC = () => {
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
      ACCESS ALBERTA LEGAL SERVICES
    </p>
  );
};
