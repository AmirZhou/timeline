import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface ConnectionArrowProps {
  isActive?: boolean;
}

export const ConnectionArrow: React.FC<ConnectionArrowProps> = ({ isActive = false }) => {
  const theme = useTheme();
  
  return (
    <svg 
      width="40" 
      height="20" 
      style={{ 
        margin: '0 10px',
        alignSelf: 'center',
      }}
    >
      <path
        d="M5 10 L30 10 M25 5 L30 10 L25 15"
        stroke={isActive ? theme.accent : theme.border}
        strokeWidth="2"
        fill="none"
        style={{
          filter: isActive ? `drop-shadow(0 0 5px ${theme.accent})` : 'none',
        }}
      />
    </svg>
  );
};
