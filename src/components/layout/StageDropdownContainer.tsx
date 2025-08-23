import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface StageDropdownContainerProps {
  children: React.ReactNode;
  isExpanded: boolean;
}

export const StageDropdownContainer: React.FC<StageDropdownContainerProps> = ({ 
  children, 
  isExpanded 
}) => {
  const theme = useTheme();
  
  return (
    <div 
      style={{ 
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: theme.background,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        minWidth: '300px',
        zIndex: 10,
        opacity: isExpanded ? 1 : 0,
        visibility: isExpanded ? 'visible' : 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: `0 4px 20px ${theme.background}80`,
      }}
    >
      {children}
    </div>
  );
};
