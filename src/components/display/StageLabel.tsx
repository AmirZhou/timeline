import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface StageLabelProps {
  text: string;
  isActive?: boolean;
  isComplete?: boolean;
}

export const StageLabel: React.FC<StageLabelProps> = ({ 
  text, 
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
    <div 
      style={{ 
        color: getColor(),
        fontSize: '0.9rem',
        textAlign: 'center',
        marginTop: '0.5rem',
        fontWeight: isActive ? 'bold' : 'normal',
      }}
    >
      {text}
    </div>
  );
};
