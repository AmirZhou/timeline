import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

export const HeaderTitle: React.FC = () => {
  const theme = useTheme();
  
  return (
    <h1 
      style={{ 
        color: theme.text,
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 0,
        letterSpacing: '0.1em',
      }}
    >
      PROJECT TIMELINE
    </h1>
  );
};
