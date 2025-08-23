import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface BidirectionalArrowProps {
  isActive?: boolean;
}

export const BidirectionalArrow: React.FC<BidirectionalArrowProps> = ({ isActive = false }) => {
  const theme = useTheme();
  
  return (
    <svg 
      width="60" 
      height="20" 
      style={{ 
        margin: '0 10px',
        alignSelf: 'center',
      }}
    >
      <path
        d="M5 10 L50 10 M45 5 L50 10 L45 15 M15 5 L10 10 L15 15"
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