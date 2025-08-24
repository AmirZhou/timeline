import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface TimelineContainerProps {
  children: React.ReactNode;
}

export const TimelineContainer: React.FC<TimelineContainerProps> = ({ children }) => {
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