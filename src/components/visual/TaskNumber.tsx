import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface TaskNumberProps {
  value: string;
  isActive?: boolean;
  isComplete?: boolean;
}

export const TaskNumber: React.FC<TaskNumberProps> = ({ 
  value, 
  isActive = false, 
  isComplete = false 
}) => {
  const theme = useTheme();
  
  const getColor = () => {
    if (isComplete) return theme.success;
    if (isActive) return theme.accent;
    return theme.textSecondary;
  };
  
  return (
    <span 
      style={{ 
        color: getColor(),
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginRight: '0.5rem',
        minWidth: '2rem',
        display: 'inline-block',
      }}
    >
      {value}
    </span>
  );
};