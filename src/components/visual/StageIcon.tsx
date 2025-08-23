import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface StageIconProps {
  type: 'play' | 'verify' | 'unlock' | 'download' | 'install';
  isActive?: boolean;
  isComplete?: boolean;
}

export const StageIcon: React.FC<StageIconProps> = ({ 
  type, 
  isActive = false, 
  isComplete = false 
}) => {
  const theme = useTheme();
  
  const getColor = () => {
    if (isComplete) return theme.success;
    if (isActive) return theme.accent;
    return theme.textSecondary;
  };
  
  const getIcon = () => {
    switch (type) {
      case 'play':
        return '▶';
      case 'verify':
        return '✓';
      case 'unlock':
        return '🔓';
      case 'download':
        return '⬇';
      case 'install':
        return '⚙';
      default:
        return '●';
    }
  };
  
  return (
    <div 
      style={{ 
        color: getColor(),
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {getIcon()}
    </div>
  );
};
