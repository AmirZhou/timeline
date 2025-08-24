import React from 'react';
import { useTimelineState } from '../providers/TimelineStateProvider';

interface TaskClickHandlerProps {
  taskId: string;
  children: React.ReactNode;
}

export const TaskClickHandler: React.FC<TaskClickHandlerProps> = ({ 
  taskId, 
  children 
}) => {
  const { setCurrentTask, completeTask } = useTimelineState();
  
  const handleClick = () => {
    setCurrentTask(taskId);
    completeTask(taskId);
  };
  
  return (
    <div 
      onClick={handleClick} 
      style={{ 
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#333333';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </div>
  );
};