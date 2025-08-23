import React from 'react';
import { SubstepStatus } from '../status/SubstepStatus';

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
}

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

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-sm text-gray-900 leading-tight">
          {task.title}
        </h3>
        <SubstepStatus 
          complete={task.properties.status === "Completed"} 
          isActive={task.properties.status === "In Progress"} 
        />
      </div>

      {task.properties.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">
          {task.properties.description}
        </p>
      )}

      <div className="flex justify-between items-center text-xs mb-3">
        <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getPriorityColor(task.properties.priority)}`}>
          {task.properties.priority}
        </span>
        <span className="text-gray-500 font-medium">
          Week {task.properties.week}
        </span>
      </div>

      <a 
        href={task.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center gap-1 transition-colors duration-200"
      >
        <span>View in Notion</span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4H7.29289L3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355C3.34171 9.04882 3.65829 9.04882 3.85355 8.85355L8 4.70711V8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5V3.5C9 3.22386 8.77614 3 8.5 3H3.5Z" fill="currentColor"/>
        </svg>
      </a>
    </div>
  );
};