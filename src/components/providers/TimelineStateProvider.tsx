import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex-api";

interface TimelineState {
  currentPhase: string;
  currentTask: string;
  completedPhases: Set<string>;
  completedTasks: Set<string>;
}

interface PhaseGroup {
  [phaseName: string]: any[];
}

interface TimelineStateContextType {
  state: TimelineState;
  setCurrentPhase: (phaseId: string) => void;
  setCurrentTask: (taskId: string) => void;
  completePhase: (phaseId: string) => void;
  completeTask: (taskId: string) => void;
  phases: PhaseGroup;
  syncStatus: any;
  isLoading: boolean;
  triggerSync: () => void;
}

const TimelineStateContext = createContext<TimelineStateContextType | undefined>(undefined);

interface TimelineStateProviderProps {
  children: ReactNode;
}

export const TimelineStateProvider: React.FC<TimelineStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<TimelineState>({
    currentPhase: 'Phase 1: Foundation & Legal Framework',
    currentTask: '1.1',
    completedPhases: new Set(),
    completedTasks: new Set(),
  });

  // Real data from Notion via Convex
  const allTasks = useQuery(api.timeline.getProjectTimeline, {});
  const syncStatus = useQuery(api.timeline.getSyncStatus, {});
  const triggerSyncAction = useAction(api.timeline.triggerNotionSync);

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

  const setCurrentPhase = (phaseId: string) => {
    setState(prev => ({ ...prev, currentPhase: phaseId }));
  };

  const setCurrentTask = (taskId: string) => {
    setState(prev => ({ ...prev, currentTask: taskId }));
  };

  const completePhase = (phaseId: string) => {
    setState(prev => ({
      ...prev,
      completedPhases: new Set([...prev.completedPhases, phaseId])
    }));
  };

  const completeTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      completedTasks: new Set([...prev.completedTasks, taskId])
    }));
  };

  const triggerSync = () => {
    triggerSyncAction({ forceFullSync: false });
  };

  return (
    <TimelineStateContext.Provider value={{
      state,
      setCurrentPhase,
      setCurrentTask,
      completePhase,
      completeTask,
      phases: phaseGroups,
      syncStatus,
      isLoading: allTasks === undefined,
      triggerSync,
    }}>
      {children}
    </TimelineStateContext.Provider>
  );
};

export const useTimelineState = () => {
  const context = useContext(TimelineStateContext);
  if (!context) {
    throw new Error('useTimelineState must be used within TimelineStateProvider');
  }
  return context;
};