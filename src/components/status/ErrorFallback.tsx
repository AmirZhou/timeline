import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface ErrorFallbackProps {
  message: string;
  retry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  message, 
  retry 
}) => {
  const colors = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div 
        className="mb-4 text-4xl"
        style={{ color: colors.error }}
      >
        ⚠️
      </div>
      <h3 
        className="mb-2 text-lg font-semibold"
        style={{ color: colors.text }}
      >
        Something went wrong
      </h3>
      <p 
        className="mb-4 text-sm"
        style={{ color: colors.textSecondary }}
      >
        {message}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: colors.accent,
            color: colors.background 
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};