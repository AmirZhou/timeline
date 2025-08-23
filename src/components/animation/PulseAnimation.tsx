import React from 'react';

interface PulseAnimationProps {
  children: React.ReactNode;
  isActive?: boolean;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({ 
  children, 
  isActive = true 
}) => {
  return (
    <div 
      style={{ 
        animation: isActive ? 'pulse 2s infinite' : 'none',
      }}
    >
      {children}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
