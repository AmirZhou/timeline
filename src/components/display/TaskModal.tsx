import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { TaskStatus } from '../status/TaskStatus';
import { ErrorFallback } from '../status/ErrorFallback';
import { TaskModalProps } from '../../types/task';
import { getStatusColor, getStatusDetails } from '../../utils/statusUtils';
import { getAssigneeDetails } from '../../utils/assigneeUtils';
import { getPriorityColor } from '../../utils/priorityUtils';


export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, taskNumber }) => {
  const theme = useTheme();
  
  if (!isOpen) return null;

  if (!task) {
    return (
      <ErrorFallback 
        message="Task data could not be loaded" 
        retry={onClose}
      />
    );
  }

  try {
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
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ 
        backgroundColor: theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.3)'
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div className="backdrop-blur-2xl border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn" style={{ backgroundColor: theme.glass.background, borderColor: theme.glass.border }}>
        {/* Header */}
        <div className="sticky top-0 border-b p-6 rounded-t-2xl" style={{ backgroundColor: theme.glass.background, borderColor: theme.glass.border }}>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center gap-3">
                {taskNumber && (
                  <span className={`text-lg font-bold font-mono ${getStatusColor(task.properties.status)}`}>
                    {taskNumber}: {task.properties.status}
                  </span>
                )}
                <TaskStatus 
                  complete={task.properties.status === "Completed"} 
                  isActive={task.properties.status === "In Progress"} 
                />
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="transition-colors p-1 rounded-full" 
              style={{ 
                color: theme.textSecondary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = theme.text;
                (e.target as HTMLElement).style.backgroundColor = theme.mode === 'dark' ? '#374151' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = theme.textSecondary;
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h2 className="text-2xl font-bold font-mono mt-4 leading-tight" style={{ color: theme.text }}>
            {task.title}
          </h2>
          
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Description Section */}
          {task.properties.description && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold font-mono text-lg" style={{ color: theme.text }}>Task Description</h3>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${assigneeDetails.color} font-mono text-xs font-bold`} style={{ borderColor: theme.border }}>
                  {assigneeDetails.initials}
                </div>
              </div>
              <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap" style={{ color: theme.textSecondary }}>
                {task.properties.description}
              </p>
            </div>
          )}



        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white font-mono underline"
          >
            View in Notion
          </a>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('TaskModal error:', error);
    return (
      <ErrorFallback 
        message="Failed to render task details" 
        retry={onClose}
      />
    );
  }
};