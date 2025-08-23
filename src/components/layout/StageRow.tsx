import React from 'react';

interface StageRowProps {
  children: React.ReactNode;
}

export const StageRow: React.FC<StageRowProps> = ({ children }) => {
  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
};