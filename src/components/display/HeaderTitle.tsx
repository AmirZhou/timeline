import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface HeaderTitleProps {
  title?: string;
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({ title = "PROJECT TIMELINE" }) => {
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
      {title}
    </h1>
  );
};
