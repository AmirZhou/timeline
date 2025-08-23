import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

export const InteractiveIndicator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <div 
      style={{ 
        color: theme.accent,
        fontSize: '0.8rem',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        border: `1px solid ${theme.accent}`,
        borderRadius: '4px',
        display: 'inline-block',
        boxShadow: `0 0 10px ${theme.accent}40`,
      }}
    >
      INTERACTIVE
    </div>
  );
};
