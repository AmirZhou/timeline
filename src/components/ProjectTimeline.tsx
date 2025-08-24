import React, { useState } from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { TimelineStateProvider } from './providers/TimelineStateProvider';
import { TimelineContainer } from './layout/TimelineContainer';
import { HorizontalTimelineLayout } from './layout/HorizontalTimelineLayout';
import { VerticalTimelineLayout } from './layout/VerticalTimelineLayout';
import { HeaderTitle } from './display/HeaderTitle';
import { HeaderSubtitle } from './display/HeaderSubtitle';
import { SyncStatusBar } from './status/SyncStatusBar';

const TimelineContent: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');

  return (
    <TimelineContainer>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <HeaderTitle />
        <HeaderSubtitle />
      </div>
      
      <SyncStatusBar />
      
      {/* Layout Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setLayoutMode('horizontal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              layoutMode === 'horizontal'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setLayoutMode('vertical')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              layoutMode === 'vertical'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Timeline View
          </button>
        </div>
      </div>
      
      {layoutMode === 'horizontal' ? (
        <HorizontalTimelineLayout />
      ) : (
        <VerticalTimelineLayout />
      )}
    </TimelineContainer>
  );
};

export const ProjectTimeline: React.FC = () => {
  return (
    <ThemeProvider>
      <TimelineStateProvider>
        <TimelineContent />
      </TimelineStateProvider>
    </ThemeProvider>
  );
};