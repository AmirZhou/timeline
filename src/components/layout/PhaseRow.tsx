import React from 'react';

interface PhaseRowProps {
  children: React.ReactNode;
}

export const PhaseRow: React.FC<PhaseRowProps> = ({ children }) => {
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