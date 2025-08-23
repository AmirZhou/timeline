import React from 'react';
import { useStageData } from '../providers/StageDataProvider';
import { useFlowState } from '../providers/FlowStateProvider';
import { StageLabel } from '../display/StageLabel';
import { SubstepText } from '../display/SubstepText';
import { StageNode } from '../visual/StageNode';
import { ConnectionArrow } from '../visual/ConnectionArrow';
import { SubstepNumber } from '../visual/SubstepNumber';
import { SubstepStatus } from '../status/SubstepStatus';
import { StageClickHandler } from '../interactive/StageClickHandler';
import { SubstepClickHandler } from '../interactive/SubstepClickHandler';
import { GlowEffect } from '../animation/GlowEffect';
import { PulseAnimation } from '../animation/PulseAnimation';
import { VerticalSubstepList } from './VerticalSubstepList';

export const ImprovedFlowLayout: React.FC = () => {
  const stages = useStageData();
  const { state } = useFlowState();

  return (
    <div className="space-y-8">
      {/* Stage Flow Row */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <StageClickHandler stageId={stage.id}>
                <GlowEffect 
                  color="#00ff00" 
                  isActive={state.currentStage === stage.id}
                >
                  <PulseAnimation isActive={state.currentStage === stage.id}>
                    <StageNode
                      iconType={stage.icon}
                      isActive={state.currentStage === stage.id}
                      isComplete={state.completedStages.has(stage.id)}
                    />
                  </PulseAnimation>
                </GlowEffect>
                <StageLabel
                  text={stage.name}
                  isActive={state.currentStage === stage.id}
                  isComplete={state.completedStages.has(stage.id)}
                />
              </StageClickHandler>
            </div>
            
            {index < stages.length - 1 && (
              <ConnectionArrow 
                isActive={state.completedStages.has(stage.id)} 
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Substeps Section - Dedicated area */}
      <div className="min-h-[200px] flex justify-center">
        {stages.map((stage) => (
          state.expandedStage === stage.id && (
            <div 
              key={`substeps-${stage.id}`} 
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full"
            >
              <h3 className="text-lg font-bold text-green-400 mb-4 text-center">
                {stage.name} Steps
              </h3>
              <VerticalSubstepList>
                {stage.substeps.map((substep) => (
                  <SubstepClickHandler key={substep.id} substepId={substep.id}>
                    <div className="flex items-center">
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
              </VerticalSubstepList>
            </div>
          )
        ))}
      </div>
    </div>
  );
};