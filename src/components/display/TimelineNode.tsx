import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface TimelineNodeProps {
  task: {
    _id: string;
    title: string;
    properties: {
      status: "Not Started" | "In Progress" | "Completed";
      priority: "Critical" | "High" | "Medium" | "Low";
      description: string;
      week: number;
      phase: string;
      assignee?: string;
    };
    url: string;
  };
  taskNumber: string;
  phaseTitle: string;
  isPhaseStart: boolean;
  onClick?: (task: any) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-500';
    case 'In Progress':
      return 'bg-yellow-500';
    case 'Not Started':
    default:
      return 'bg-red-500';
  }
};

export const TimelineNode: React.FC<TimelineNodeProps> = ({ 
  task, 
  taskNumber, 
  phaseTitle, 
  isPhaseStart, 
  onClick 
}) => {
  const theme = useTheme();
  const handleClick = () => {
    onClick?.(task);
  };

  return (
    <div className="relative flex items-start group">
      {/* Timeline Dot */}
      <div className="absolute left-6 -ml-2 w-4 h-4 bg-white rounded-full border-4 border-gray-800 z-10"></div>
      
      <div className="ml-16 cursor-pointer" onClick={handleClick}>
        {/* Phase Title (only for first task of phase) */}
        {isPhaseStart && (
          <div className="text-white font-mono text-lg font-bold mb-2 tracking-wide">
            {phaseTitle}
          </div>
        )}
        
        {/* Task Content */}
        <div className="flex items-start space-x-4 p-3 rounded-lg transition-all duration-200">
          {/* Task Number and Status */}
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-gray-400 font-mono text-sm min-w-[3rem]">
              {taskNumber}
            </span>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(task.properties.status)}`}></div>
          </div>
          
          {/* Task Title */}
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium leading-relaxed group-hover:text-[#00ff00] transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-[#00ff00] focus:ring-opacity-50">
              {task.title}
            </div>
            {task.properties.assignee && (
              <div className="text-gray-400 text-xs font-mono mt-1">
                {task.properties.assignee}
              </div>
            )}
          </div>
          
          {/* Priority (subtle integration) */}
          {task.properties.priority === 'Critical' && (
            <div className="text-red-400 text-xs font-mono">
              !
            </div>
          )}
        </div>
      </div>
    </div>
  );
};