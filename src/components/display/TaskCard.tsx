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
      return 'bg-red-100 text-red-800 border-red-200';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
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
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer min-h-[48px] flex items-center justify-between active:scale-95"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(task.properties.status)}`}></div>
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-500 flex-shrink-0">{taskNumber}</span>
          <span className="text-sm font-medium text-gray-900 truncate">
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