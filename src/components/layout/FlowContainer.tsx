import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface FlowContainerProps {
  children: React.ReactNode;
}

export const FlowContainer: React.FC<FlowContainerProps> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <div 
      style={{ 
        backgroundColor: theme.background,
        color: theme.text,
        padding: '2rem',
        borderRadius: '8px',
        minHeight: '600px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        border: `1px solid ${theme.border}`,
      }}
    >
      {children}
    </div>
  );
};
