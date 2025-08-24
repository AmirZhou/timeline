import React from 'react';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    properties: {
      status: "Not Started" | "In Progress" | "Completed";
      priority: "Critical" | "High" | "Medium" | "Low";
      description: string;
      week: number;
      phase: string;
    };
    url: string;
  };
  taskNumber: string;
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-900 bg-opacity-30 text-red-300 border-red-700';
    case 'High':
      return 'bg-orange-900 bg-opacity-30 text-orange-300 border-orange-700';
    case 'Medium':
      return 'bg-yellow-900 bg-opacity-30 text-yellow-300 border-yellow-700';
    case 'Low':
      return 'bg-green-900 bg-opacity-30 text-green-300 border-green-700';
    default:
      return 'bg-gray-900 bg-opacity-30 text-gray-300 border-gray-700';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, taskNumber, onClick }) => {
  const handleClick = () => {
    onClick?.(task);
  };

  const getShortTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 p-3 hover:bg-opacity-70 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer min-h-[48px] flex items-center justify-between active:scale-95 backdrop-blur-sm"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(task.properties.status)}`}></div>
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-400 flex-shrink-0">{taskNumber}</span>
          <span className="text-sm font-medium text-white truncate">
            {getShortTitle(task.title)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {(task.properties.priority === 'Critical' || task.properties.priority === 'High') && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.properties.priority)}`}>
            {task.properties.priority}
          </span>
        )}
      </div>
    </div>
  );
};