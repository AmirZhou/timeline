import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface SubstepStatusProps {
  complete: boolean;
  hasWarning?: boolean;
  hasError?: boolean;
}

export const SubstepStatus: React.FC<SubstepStatusProps> = ({ 
  complete, 
  hasWarning = false, 
  hasError = false 
}) => {
  const theme = useTheme();
  
  const getIcon = () => {
    if (hasError) return '✗';
    if (hasWarning) return '⚠';
    if (complete) return '✓';
    return '○';
  };
  
  const getColor = () => {
    if (hasError) return theme.error;
    if (hasWarning) return theme.warning;
    if (complete) return theme.success;
    return theme.textSecondary;
  };
  
  return (
    <span 
      style={{ 
        color: getColor(),
        fontSize: '0.9rem',
        marginLeft: '0.5rem',
      }}
    >
      {getIcon()}
    </span>
  );
};
