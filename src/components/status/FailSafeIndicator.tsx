import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

export const FailSafeIndicator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <div 
      style={{ 
        color: theme.warning,
        fontSize: '0.8rem',
        padding: '0.5rem',
        border: `1px solid ${theme.warning}`,
        borderRadius: '4px',
        backgroundColor: `${theme.warning}10`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span>⚠</span>
      <span>FAIL-SAFE ACTIVE</span>
    </div>
  );
};
