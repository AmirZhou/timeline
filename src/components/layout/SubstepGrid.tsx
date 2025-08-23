import React from 'react';
import { useStageData } from '../providers/StageDataProvider';
import { useFlowState } from '../providers/FlowStateProvider';
import { SubstepClickHandler } from '../interactive/SubstepClickHandler';
import { SubstepNumber } from '../visual/SubstepNumber';
import { SubstepText } from '../display/SubstepText';
import { SubstepStatus } from '../status/SubstepStatus';

export const SubstepGrid: React.FC = () => {
  const stages = useStageData();
  const { state } = useFlowState();
  
  return (
    <div 
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${stages.length}, 1fr)`,
        gap: '1rem',
        alignItems: 'start',
        justifyContent: 'center',
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      {stages.map((stage) => (
        <div 
          key={stage.id} 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            minWidth: '200px',
          }}
        >
          {stage.substeps.map((substep) => (
            <SubstepClickHandler key={substep.id} substepId={substep.id}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <SubstepNumber
                  value={substep.number}
                  isActive={state.currentSubstep === substep.id}
                  isComplete={state.completedSubsteps.has(substep.id)}
                />
                <SubstepText
                  content={substep.text}
                  isActive={state.currentSubstep === substep.id}
                  isComplete={state.completedSubsteps.has(substep.id)}
                />
                <SubstepStatus
                  complete={state.completedSubsteps.has(substep.id)}
                />
              </div>
            </SubstepClickHandler>
          ))}
        </div>
      ))}
    </div>
  );
};