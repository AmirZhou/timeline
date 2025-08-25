import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { TimelineStateProvider } from './providers/TimelineStateProvider';
import { TimelineContainer } from './layout/TimelineContainer';
import { VerticalTimelineLayout } from './layout/VerticalTimelineLayout';
import { HeaderTitle } from './display/HeaderTitle';
import { HeaderSubtitle } from './display/HeaderSubtitle';
import { SyncStatusBar } from './status/SyncStatusBar';
import { TimelineConfig } from '../types/config';

interface TimelineContentProps {
  config?: TimelineConfig;
}

const TimelineContent: React.FC<TimelineContentProps> = ({ config }) => {
  return (
    <TimelineContainer>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <HeaderTitle title={config?.title} />
        <HeaderSubtitle subtitle={config?.subtitle} />
      </div>
      
      <SyncStatusBar />
      
      <VerticalTimelineLayout />
    </TimelineContainer>
  );
};

interface ProjectTimelineProps {
  config?: TimelineConfig;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ config }) => {
  return (
    <ThemeProvider>
      <TimelineStateProvider>
        <TimelineContent config={config} />
      </TimelineStateProvider>
    </ThemeProvider>
  );
};