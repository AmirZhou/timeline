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
        backgroundColor: '#000000',
        color: theme.text,
        padding: '2rem',
        borderRadius: '8px',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace',
      }}
    >
      {children}
    </div>
  );
};
