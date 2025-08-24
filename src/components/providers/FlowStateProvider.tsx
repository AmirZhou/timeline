import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface FlowState {
  currentStage: string;
  currentSubstep: string;
  completedStages: Set<string>;
  completedSubsteps: Set<string>;
}

interface PhaseGroup {
  [phaseName: string]: any[];
}

interface FlowStateContextType {
  state: FlowState;
  setCurrentStage: (stageId: string) => void;
  setCurrentSubstep: (substepId: string) => void;
  completeStage: (stageId: string) => void;
  completeSubstep: (substepId: string) => void;
  phases: PhaseGroup;
  syncStatus: any;
  isLoading: boolean;
  triggerSync: () => void;
}

const FlowStateContext = createContext<FlowStateContextType | undefined>(undefined);

interface FlowStateProviderProps {
  children: ReactNode;
}

export const FlowStateProvider: React.FC<FlowStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<FlowState>({
    currentStage: 'Phase 1: Foundation & Legal Framework',
    currentSubstep: '1.1',
    completedStages: new Set(),
    completedSubsteps: new Set(),
  });

  // Real data from Notion via Convex
  const allTasks = useQuery(api.demo.getProjectTimeline, {});
  const syncStatus = useQuery(api.demo.getSyncStatus, {});
  const triggerSyncAction = useAction(api.demo.triggerNotionSync);

  // Group tasks by phases for 4-column layout
  const phaseGroups = useMemo(() => {
    if (!allTasks) return {};

    return allTasks.reduce((groups: PhaseGroup, task: any) => {
      const phase = task.properties.phase || 'Unknown';
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(task);
      return groups;
    }, {});
  }, [allTasks]);

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

  const triggerSync = () => {
    triggerSyncAction({ forceFullSync: false });
  };

  return (
    <FlowStateContext.Provider value={{
      state,
      setCurrentStage,
      setCurrentSubstep,
      completeStage,
      completeSubstep,
      phases: phaseGroups,
      syncStatus,
      isLoading: allTasks === undefined,
      triggerSync,
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
