import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

export const VersionIndicator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <div 
      style={{ 
        color: theme.textSecondary,
        fontSize: '0.8rem',
        textAlign: 'center',
        margin: '1rem 0',
      }}
    >
      4.0 Final Update from
    </div>
  );
};
