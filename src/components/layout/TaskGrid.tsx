import React from 'react';
import { usePhaseData } from '../providers/PhaseDataProvider';
import { useTimelineState } from '../providers/TimelineStateProvider';
import { TaskClickHandler } from '../interactive/TaskClickHandler';
import { TaskNumber } from '../visual/TaskNumber';
import { TaskText } from '../display/TaskText';
import { TaskStatus } from '../status/TaskStatus';

export const TaskGrid: React.FC = () => {
  const phases = usePhaseData();
  const { state } = useTimelineState();
  
  return (
    <div 
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${phases.length}, 1fr)`,
        gap: '1rem',
        alignItems: 'start',
        justifyContent: 'center',
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      {phases.map((phase) => (
        <div 
          key={phase.id} 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            minWidth: '200px',
          }}
        >
          {phase.tasks.map((task) => (
            <TaskClickHandler key={task.id} taskId={task.id}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <TaskNumber
                  value={task.number}
                  isActive={state.currentTask === task.id}
                  isComplete={state.completedTasks.has(task.id)}
                />
                <TaskText
                  content={task.text}
                  isActive={state.currentTask === task.id}
                  isComplete={state.completedTasks.has(task.id)}
                />
                <TaskStatus
                  complete={state.completedTasks.has(task.id)}
                />
              </div>
            </TaskClickHandler>
          ))}
        </div>
      ))}
    </div>
  );
};