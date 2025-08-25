import React from 'react';
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider, ThemeMode } from './components/providers/ThemeProvider';
import { TimelineStateProvider } from './components/providers/TimelineStateProvider';
import { TimelineContainer } from './components/layout/TimelineContainer';
import { VerticalTimelineLayout } from './components/layout/VerticalTimelineLayout';
import { SyncStatusBar } from './components/status/SyncStatusBar';

// Multi-framework environment variable detection
const getConvexUrl = (providedUrl?: string): string => {
  if (providedUrl) {
    return providedUrl;
  }

  // Try multiple environment variable patterns
  const envUrl = 
    process.env.VITE_CONVEX_URL ||           // Vite
    process.env.NEXT_PUBLIC_CONVEX_URL ||    // Next.js  
    process.env.REACT_APP_CONVEX_URL ||      // Create React App
    process.env.CONVEX_URL;                  // Node/others

  if (!envUrl) {
    throw new Error(
      'Convex URL is required. Please provide it via:\n' +
      '- convexUrl prop, or\n' +
      '- Environment variable: VITE_CONVEX_URL, NEXT_PUBLIC_CONVEX_URL, REACT_APP_CONVEX_URL, or CONVEX_URL'
    );
  }

  return envUrl;
};

interface TimelineProps {
  /**
   * Theme mode for the timeline component
   * @default 'dark'
   */
  theme?: ThemeMode;
  
  /**
   * Optional CSS class name for the timeline container
   */
  className?: string;
  
  /**
   * Convex deployment URL. If not provided, will attempt to read from environment variables:
   * VITE_CONVEX_URL, NEXT_PUBLIC_CONVEX_URL, REACT_APP_CONVEX_URL, or CONVEX_URL
   */
  convexUrl?: string;
}

/**
 * A reusable React timeline component with Notion integration
 * 
 * Features:
 * - Dark/Light theme support with glassmorphic design
 * - Real-time sync with Notion database
 * - Multi-framework environment variable support
 * - Accessible and responsive design
 * - No external CSS imports required
 * 
 * @example
 * ```tsx
 * // Basic usage with environment variable
 * <Timeline />
 * 
 * // With explicit configuration
 * <Timeline 
 *   theme="light" 
 *   convexUrl="https://your-deployment.convex.cloud"
 *   className="my-timeline-wrapper"
 * />
 * ```
 */
export const Timeline: React.FC<TimelineProps> = ({ 
  theme = 'dark',
  className,
  convexUrl: providedConvexUrl
}) => {
  // Initialize Convex client with URL detection
  const convexUrl = getConvexUrl(providedConvexUrl);
  const convexClient = React.useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  return (
    <ConvexProvider client={convexClient}>
      <ThemeProvider theme={theme}>
        <TimelineStateProvider>
          <div className={className}>
            <TimelineContainer>
              <SyncStatusBar />
              <VerticalTimelineLayout />
            </TimelineContainer>
          </div>
        </TimelineStateProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
};

export default Timeline;