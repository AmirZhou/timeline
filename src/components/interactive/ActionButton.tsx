import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface ActionButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  const theme = useTheme();
  
  const getBackgroundColor = () => {
    if (disabled) return theme.border;
    return variant === 'primary' ? theme.accent : 'transparent';
  };
  
  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    return variant === 'primary' ? theme.background : theme.accent;
  };
  
  const getBorderColor = () => {
    if (disabled) return theme.border;
    return theme.accent;
  };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      style={{ 
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        border: `1px solid ${getBorderColor()}`,
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        boxShadow: !disabled && variant === 'primary' ? `0 0 10px ${theme.accent}40` : 'none',
      }}
    >
      {text}
    </button>
  );
};
