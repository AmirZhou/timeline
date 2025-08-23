import React from 'react';

interface HorizontalFlowLayoutProps {
  children: React.ReactNode;
}

export const HorizontalFlowLayout: React.FC<HorizontalFlowLayoutProps> = ({ children }) => {
  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '1rem',
        margin: '2rem 0',
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
};
