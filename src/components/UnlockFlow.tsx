import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { StageDataProvider, useStageData } from './providers/StageDataProvider';
import { FlowStateProvider, useFlowState } from './providers/FlowStateProvider';
import { FlowContainer } from './layout/FlowContainer';
import { StageRow } from './layout/StageRow';
import { SubstepGrid } from './layout/SubstepGrid';
import { HeaderTitle } from './display/HeaderTitle';
import { HeaderSubtitle } from './display/HeaderSubtitle';
import { VersionIndicator } from './display/VersionIndicator';
import { InteractiveIndicator } from './display/InteractiveIndicator';
import { StageLabel } from './display/StageLabel';
import { SubstepText } from './display/SubstepText';
import { StageNode } from './visual/StageNode';
import { ConnectionArrow } from './visual/ConnectionArrow';
import { SubstepNumber } from './visual/SubstepNumber';
import { ProgressBar } from './visual/ProgressBar';
import { SubstepStatus } from './status/SubstepStatus';
import { FailSafeIndicator } from './status/FailSafeIndicator';
import { StageClickHandler } from './interactive/StageClickHandler';
import { ActionButton } from './interactive/ActionButton';
import { GlowEffect } from './animation/GlowEffect';
import { PulseAnimation } from './animation/PulseAnimation';

const FlowContent: React.FC = () => {
  const stages = useStageData();
  const { state } = useFlowState();
  
  const calculateProgress = () => {
    const totalSubsteps = stages.reduce((acc, stage) => acc + stage.substeps.length, 0);
    const completedSubsteps = state.completedSubsteps.size;
    return (completedSubsteps / totalSubsteps) * 100;
  };
  
  return (
    <FlowContainer>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <HeaderTitle />
        <HeaderSubtitle />
      </div>
      
      <StageRow>
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          </React.Fragment>
        ))}
      </StageRow>
      
      <SubstepGrid />
      
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <ProgressBar percentage={calculateProgress()} />
        <div style={{ margin: '1rem 0' }}>
          <ActionButton
            text="START UNLOCK PROCESS"
            onClick={() => console.log('Starting unlock process...')}
            variant="primary"
          />
        </div>
        <FailSafeIndicator />
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <VersionIndicator />
        <InteractiveIndicator />
      </div>
    </FlowContainer>
  );
};

export const UnlockFlow: React.FC = () => {
  return (
    <ThemeProvider>
      <StageDataProvider>
        <FlowStateProvider>
          <FlowContent />
        </FlowStateProvider>
      </StageDataProvider>
    </ThemeProvider>
  );
};
