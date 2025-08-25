import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { ErrorFallback } from './ErrorFallback';

interface TaskStatusProps {
  complete: boolean;
  hasWarning?: boolean;
  hasError?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
}

export const TaskStatus: React.FC<TaskStatusProps> = ({ 
  complete, 
  hasWarning = false, 
  hasError = false,
  isLoading = false,
  isActive = false
}) => {
  try {
    const theme = useTheme();
  
  const getIcon = () => {
    if (isLoading) return '⟳';
    if (hasError) return '✗';
    if (hasWarning) return '⚠';
    if (complete) return '✓';
    return '○';
  };
  
  const getColor = () => {
    if (isLoading) return theme.accent;
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
      className={isLoading ? 'animate-spin' : ''}
    >
      {getIcon()}
    </span>
  );
  } catch (error) {
    console.error('TaskStatus error:', error);
    return (
      <ErrorFallback 
        message="Status unavailable" 
      />
    );
  }
};