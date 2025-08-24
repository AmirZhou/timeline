import React from 'react';
import { SubstepStatus } from '../status/SubstepStatus';

interface TaskModalProps {
  task: {
    _id: string;
    title: string;
    properties: {
      status: "Not Started" | "In Progress" | "Completed";
      priority: "Critical" | "High" | "Medium" | "Low";
      assignee?: string;
      description: string;
      week: number;
      phase: string;
    };
    url: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  taskNumber?: string;
}

const getAssigneeColor = (assignee?: string) => {
  if (!assignee) return 'text-gray-400';
  
  // Create consistent colors for different assignees
  const colors = [
    'text-cyan-400',
    'text-purple-400',
    'text-green-400',
    'text-yellow-400',
    'text-pink-400',
    'text-blue-400'
  ];
  
  // Simple hash to consistently assign colors to names
  let hash = 0;
  for (let i = 0; i < assignee.length; i++) {
    hash = assignee.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-900/20 text-red-400 border-red-800';
    case 'High':
      return 'bg-orange-900/20 text-orange-400 border-orange-800';
    case 'Medium':
      return 'bg-yellow-900/20 text-yellow-400 border-yellow-800';
    case 'Low':
      return 'bg-green-900/20 text-green-400 border-green-800';
    default:
      return 'bg-gray-900/20 text-gray-400 border-gray-800';
  }
};

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'Completed':
      return {
        color: 'text-green-400',
        bgColor: 'bg-gray-900 border-gray-700',
        dotColor: 'bg-green-400',
        icon: '✅',
        description: 'This task has been completed successfully.'
      };
    case 'In Progress':
      return {
        color: 'text-yellow-400',
        bgColor: 'bg-gray-900 border-gray-700',
        dotColor: 'bg-yellow-400',
        icon: '🔄',
        description: 'This task is currently being worked on.'
      };
    case 'Not Started':
    default:
      return {
        color: 'text-red-400',
        bgColor: 'bg-gray-900 border-gray-700',
        dotColor: 'bg-red-400',
        icon: '⏳',
        description: 'This task has not been started yet.'
      };
  }
};

const getAssigneeInitials = (assignee?: string) => {
  if (!assignee) return '??';
  
  const names = assignee.split(' ');
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  }
  return assignee.substring(0, 2).toUpperCase();
};

const getAssigneeDetails = (assignee?: string) => {
  if (!assignee) {
    return {
      display: 'Unassigned',
      description: 'This task has not been assigned to a developer yet.',
      initials: '??',
      color: 'text-gray-400'
    };
  }
  
  return {
    display: assignee,
    description: `This task is assigned to ${assignee}`,
    initials: getAssigneeInitials(assignee),
    color: getAssigneeColor(assignee)
  };
};

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, taskNumber }) => {
  if (!isOpen || !task) return null;

  const statusDetails = getStatusDetails(task.properties.status);
  const assigneeDetails = getAssigneeDetails(task.properties.assignee);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div className="bg-black border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-gray-700 p-6 rounded-t-xl backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center gap-3">
                {taskNumber && (
                  <span className="text-lg font-bold font-mono text-white bg-gray-800 border border-gray-600 px-3 py-1 rounded-lg">
                    {taskNumber}
                  </span>
                )}
                <SubstepStatus 
                  complete={task.properties.status === "Completed"} 
                  isActive={task.properties.status === "In Progress"} 
                />
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h2 className="text-2xl font-bold font-mono text-white mt-4 leading-tight">
            {task.title}
          </h2>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center ${assigneeDetails.color} font-mono text-xs font-bold`}>
                {assigneeDetails.initials}
              </div>
              <span className={`font-mono text-sm ${assigneeDetails.color}`}>
                {assigneeDetails.display}
              </span>
            </div>
            <span className="text-gray-400 font-mono font-medium">
              Week {task.properties.week}
            </span>
            <span className="text-gray-400 font-mono">
              Phase: {task.properties.phase}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className={`rounded-lg border p-4 ${statusDetails.bgColor}`}>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8">
                <div className={`w-3 h-3 ${statusDetails.dotColor} rounded-full animate-pulse`}></div>
              </div>
              <div>
                <h3 className={`font-semibold font-mono ${statusDetails.color} text-lg`}>
                  Status: {task.properties.status}
                </h3>
                <p className="text-gray-400 mt-1 font-mono text-sm">
                  {statusDetails.description}
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {task.properties.description && (
            <div>
              <h3 className="font-semibold font-mono text-white text-lg mb-3">📝 Task Description</h3>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {task.properties.description}
                </p>
              </div>
            </div>
          )}

          {/* Assignee Details Section */}
          <div>
            <h3 className="font-semibold font-mono text-white text-lg mb-3">👤 Assignment Information</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center ${assigneeDetails.color} font-mono text-lg font-bold`}>
                  {assigneeDetails.initials}
                </div>
                <div className="flex-1">
                  <p className={`font-mono font-semibold ${assigneeDetails.color} text-lg`}>
                    {assigneeDetails.display}
                  </p>
                  <p className="text-gray-400 font-mono text-sm mt-1">
                    {assigneeDetails.description}
                  </p>
                  {task.properties.priority && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-gray-500 font-mono text-xs">Priority:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-mono ${getPriorityColor(task.properties.priority)}`}>
                        {task.properties.priority}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h3 className="font-semibold font-mono text-white text-lg mb-3">📅 Timeline Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-400 font-mono font-medium">📍 Scheduled Week</span>
                </div>
                <p className="text-lg font-bold font-mono text-cyan-300">Week {task.properties.week}</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 font-mono font-medium">🏗️ Project Phase</span>
                </div>
                <p className="text-sm font-semibold font-mono text-green-300">{task.properties.phase}</p>
              </div>
            </div>
          </div>

          {/* Task ID and Links Section */}
          <div>
            <h3 className="font-semibold font-mono text-white text-lg mb-3">🔗 References</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div>
                  <span className="text-sm font-mono font-medium text-gray-400">Task ID:</span>
                  <span className="ml-2 font-mono text-sm text-gray-300">{task._id}</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(task._id)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-mono font-medium transition-colors"
                >
                  Copy ID
                </button>
              </div>
              
              <a 
                href={task.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <span className="font-mono font-medium text-cyan-400">View in Notion</span>
                    <p className="text-sm font-mono text-gray-400">Open the full task details in Notion workspace</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4H7.29289L3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355C3.34171 9.04882 3.65829 9.04882 3.85355 8.85355L8 4.70711V8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5V3.5C9 3.22386 8.77614 3 8.5 3H3.5Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black border-t border-gray-700 p-4 rounded-b-xl backdrop-blur-sm">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white font-mono font-medium transition-colors"
            >
              Close
            </button>
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="px-6 py-2 bg-gray-800 text-cyan-400 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-cyan-300 font-mono font-medium transition-all flex items-center gap-2"
            >
              Open in Notion
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 12 12">
                <path d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4H7.29289L3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355C3.34171 9.04882 3.65829 9.04882 3.85355 8.85355L8 4.70711V8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5V3.5C9 3.22386 8.77614 3 8.5 3H3.5Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};