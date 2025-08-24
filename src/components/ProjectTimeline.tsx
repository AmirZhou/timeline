import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { TimelineStateProvider } from './providers/TimelineStateProvider';
import { TimelineContainer } from './layout/TimelineContainer';
import { VerticalTimelineLayout } from './layout/VerticalTimelineLayout';
import { HeaderTitle } from './display/HeaderTitle';
import { HeaderSubtitle } from './display/HeaderSubtitle';
import { SyncStatusBar } from './status/SyncStatusBar';

const TimelineContent: React.FC = () => {
  return (
    <TimelineContainer>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <HeaderTitle />
        <HeaderSubtitle />
      </div>
      
      <SyncStatusBar />
      
      <VerticalTimelineLayout />
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