import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { PhaseIcon } from './PhaseIcon';

interface PhaseNodeProps {
  iconType: 'play' | 'verify' | 'unlock' | 'download' | 'install';
  isActive?: boolean;
  isComplete?: boolean;
  children?: React.ReactNode;
}

export const PhaseNode: React.FC<PhaseNodeProps> = ({ 
  iconType, 
  isActive = false, 
  isComplete = false,
  children 
}) => {
  const theme = useTheme();
  
  const getBorderColor = () => {
    if (isComplete) return theme.success;
    if (isActive) return theme.accent;
    return theme.border;
  };
  
  const getBoxShadow = () => {
    if (isActive) return `0 0 20px ${theme.accent}60`;
    if (isComplete) return `0 0 15px ${theme.success}40`;
    return 'none';
  };
  
  return (
    <div 
      style={{ 
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: `2px solid ${getBorderColor()}`,
        backgroundColor: theme.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: getBoxShadow(),
      }}
    >
      <PhaseIcon type={iconType} isActive={isActive} isComplete={isComplete} />
      {children}
    </div>
  );
};