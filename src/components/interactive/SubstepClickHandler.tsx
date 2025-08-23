import React from 'react';
import { useFlowState } from '../providers/FlowStateProvider';

interface SubstepClickHandlerProps {
  substepId: string;
  children: React.ReactNode;
}

export const SubstepClickHandler: React.FC<SubstepClickHandlerProps> = ({ 
  substepId, 
  children 
}) => {
  const { setCurrentSubstep, completeSubstep } = useFlowState();
  
  const handleClick = () => {
    setCurrentSubstep(substepId);
    completeSubstep(substepId);
  };
  
  return (
    <div 
      onClick={handleClick} 
      style={{ 
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#333333';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </div>
  );
};
