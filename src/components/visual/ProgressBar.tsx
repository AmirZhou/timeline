import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const theme = useTheme();
  
  return (
    <div 
      style={{ 
        width: '100%',
        height: '8px',
        backgroundColor: theme.border,
        borderRadius: '4px',
        overflow: 'hidden',
        margin: '1rem 0',
      }}
    >
      <div 
        style={{ 
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: theme.accent,
          transition: 'width 0.3s ease',
          boxShadow: `0 0 10px ${theme.accent}60`,
        }}
      />
    </div>
  );
};
