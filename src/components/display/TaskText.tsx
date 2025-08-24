import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface TaskTextProps {
  content: string;
  isActive?: boolean;
  isComplete?: boolean;
}

export const TaskText: React.FC<TaskTextProps> = ({ 
  content, 
  isActive = false, 
  isComplete = false 
}) => {
  const theme = useTheme();
  
  const getColor = () => {
    if (isComplete) return theme.success;
    if (isActive) return theme.text;
    return theme.textSecondary;
  };
  
  return (
    <span 
      style={{ 
        color: getColor(),
        fontSize: '0.85rem',
        textDecoration: isComplete ? 'line-through' : 'none',
      }}
    >
      {content}
    </span>
  );
};