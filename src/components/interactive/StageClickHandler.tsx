import React from 'react';
import { useFlowState } from '../providers/FlowStateProvider';

interface StageClickHandlerProps {
  stageId: string;
  children: React.ReactNode;
}

export const StageClickHandler: React.FC<StageClickHandlerProps> = ({ 
  stageId, 
  children 
}) => {
  const { setCurrentStage } = useFlowState();
  
  const handleClick = () => {
    setCurrentStage(stageId);
  };
  
  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};
