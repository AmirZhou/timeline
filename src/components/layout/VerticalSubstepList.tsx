import React from 'react';

interface VerticalSubstepListProps {
  children: React.ReactNode;
}

export const VerticalSubstepList: React.FC<VerticalSubstepListProps> = ({ children }) => {
  return (
    <div 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '1rem',
        marginTop: '1rem',
      }}
    >
      {children}
    </div>
  );
};
