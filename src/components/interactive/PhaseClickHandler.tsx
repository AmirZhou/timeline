import React from 'react';
import { useTimelineState } from '../providers/TimelineStateProvider';

interface PhaseClickHandlerProps {
  phaseId: string;
  children: React.ReactNode;
}

export const PhaseClickHandler: React.FC<PhaseClickHandlerProps> = ({ 
  phaseId, 
  children 
}) => {
  const { setCurrentPhase } = useTimelineState();
  
  const handleClick = () => {
    setCurrentPhase(phaseId);
  };
  
  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};