import React from 'react';

interface VerticalTaskListProps {
  children: React.ReactNode;
}

export const VerticalTaskList: React.FC<VerticalTaskListProps> = ({ children }) => {
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