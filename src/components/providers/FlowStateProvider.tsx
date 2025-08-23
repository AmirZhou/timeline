import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FlowState {
  currentStage: string;
  currentSubstep: string;
  completedStages: Set<string>;
  completedSubsteps: Set<string>;
}

interface FlowStateContextType {
  state: FlowState;
  setCurrentStage: (stageId: string) => void;
  setCurrentSubstep: (substepId: string) => void;
  completeStage: (stageId: string) => void;
  completeSubstep: (substepId: string) => void;
}

const FlowStateContext = createContext<FlowStateContextType | undefined>(undefined);

interface FlowStateProviderProps {
  children: ReactNode;
}

export const FlowStateProvider: React.FC<FlowStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<FlowState>({
    currentStage: 'enter-site',
    currentSubstep: '1.1',
    completedStages: new Set(),
    completedSubsteps: new Set(),
  });

  const setCurrentStage = (stageId: string) => {
    setState(prev => ({ ...prev, currentStage: stageId }));
  };

  const setCurrentSubstep = (substepId: string) => {
    setState(prev => ({ ...prev, currentSubstep: substepId }));
  };

  const completeStage = (stageId: string) => {
    setState(prev => ({
      ...prev,
      completedStages: new Set([...prev.completedStages, stageId])
    }));
  };

  const completeSubstep = (substepId: string) => {
    setState(prev => ({
      ...prev,
      completedSubsteps: new Set([...prev.completedSubsteps, substepId])
    }));
  };

  return (
    <FlowStateContext.Provider value={{
      state,
      setCurrentStage,
      setCurrentSubstep,
      completeStage,
      completeSubstep,
    }}>
      {children}
    </FlowStateContext.Provider>
  );
};

export const useFlowState = () => {
  const context = useContext(FlowStateContext);
  if (!context) {
    throw new Error('useFlowState must be used within FlowStateProvider');
  }
  return context;
};
