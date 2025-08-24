import React from 'react';

export interface NotionPropagationWarningProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

export const NotionPropagationWarning: React.FC<NotionPropagationWarningProps> = ({ 
  isVisible, 
  onDismiss 
}) => {
  if (!isVisible) return null;

  return (
    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-yellow-600 flex-shrink-0 mt-0.5"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13ZM13 17H11V15H13V17Z" 
              fill="currentColor"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Data may be propagating
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              If changes don't appear, wait 20-30 seconds and refresh again.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M18 6L6 18M6 6L18 18" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};