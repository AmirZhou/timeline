import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useAction } from "convex/react";
import { api } from "../../../convex-api";
import { ErrorBoundary } from '../status/ErrorBoundary';
import { ErrorFallback } from '../status/ErrorFallback';

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
  syncStatus: { status: string; lastSyncTime: number | null; recordCount: number; error?: string };
  isLoading: boolean;
  triggerSync: () => void;
  lastFetch: Date | null;
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

  // Direct Notion API - bypasses Convex database entirely
  const [allTasks, setAllTasks] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState({ status: 'direct_api', lastSyncTime: null, recordCount: 0, error: undefined });
  
  const getProjectTimelineDirectAction = useAction(api.directNotionApi.getProjectTimelineDirect);

  // Group tasks by phases for 4-column layout
  const phaseGroups = useMemo(() => {
    if (!allTasks) return {};

    const groups = allTasks.reduce((groups: PhaseGroup, task: any) => {
      const phase = task.properties.phase || 'Phase 1: Foundation & Legal Framework';
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(task);
      return groups;
    }, {});
    return groups;
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

  const triggerSync = async () => {
    console.log("🔄 Starting direct API fetch...");
    setIsLoading(true);
    try {
      const result = await getProjectTimelineDirectAction({});
      console.log("✅ Direct API fetch completed:", result);
      setAllTasks(result);
      setLastFetch(new Date());
      setSyncStatus({ 
        status: 'success', 
        lastSyncTime: Date.now(), 
        recordCount: result.length 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("❌ Direct API fetch failed:", error);
      setSyncStatus({ 
        status: 'error', 
        lastSyncTime: Date.now(), 
        recordCount: 0,
        error: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    triggerSync();
  }, []);

  const contextValue = useMemo(() => ({
    state,
    setCurrentPhase,
    setCurrentTask,
    completePhase,
    completeTask,
    phases: phaseGroups,
    syncStatus,
    isLoading,
    triggerSync,
    lastFetch,
  }), [state, phaseGroups, syncStatus, isLoading, lastFetch]);

  return (
    <ErrorBoundary
      fallback={(
        <ErrorFallback 
          message="Failed to load timeline state" 
          retry={triggerSync}
        />
      )}
    >
      <TimelineStateContext.Provider value={contextValue}>
        {children}
      </TimelineStateContext.Provider>
    </ErrorBoundary>
  );
};

export const useTimelineState = () => {
  const context = useContext(TimelineStateContext);
  if (!context) {
    throw new Error('useTimelineState must be used within TimelineStateProvider');
  }
  return context;
};