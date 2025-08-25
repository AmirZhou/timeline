import React from 'react';

/**
 * Utility functions for task display and formatting
 */

/**
 * Formats a task title with week prefix for better context in the UI
 * @param title - The original task title
 * @param week - The week number (optional)
 * @returns Formatted title with "Week X: " prefix if week is provided, otherwise original title
 */
export const formatTaskTitle = (title: string, week?: number): string => {
  if (!week || week <= 0) return title;
  return `Week ${week}: ${title}`;
};

/**
 * Converts URLs in text to clickable links
 * @param text - Text that may contain URLs
 * @param linkStyle - CSS styles for links
 * @returns JSX with clickable links
 */
export const renderTextWithLinks = (text: string, linkStyle?: React.CSSProperties) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          style={{
            color: '#3b82f6',
            ...linkStyle
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};