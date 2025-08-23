import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { FlowStateProvider } from './providers/FlowStateProvider';
import { FlowContainer } from './layout/FlowContainer';
import { HorizontalFlowLayout } from './layout/HorizontalFlowLayout';
import { HeaderTitle } from './display/HeaderTitle';
import { HeaderSubtitle } from './display/HeaderSubtitle';
import { VersionIndicator } from './display/VersionIndicator';
import { InteractiveIndicator } from './display/InteractiveIndicator';
import { SyncStatusBar } from './status/SyncStatusBar';

const FlowContent: React.FC = () => {
  return (
    <FlowContainer>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <HeaderTitle />
        <HeaderSubtitle />
      </div>
      
      <SyncStatusBar />
      
      <HorizontalFlowLayout />
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <VersionIndicator />
        <InteractiveIndicator />
      </div>
    </FlowContainer>
  );
};

export const UnlockFlow: React.FC = () => {
  return (
    <ThemeProvider>
      <FlowStateProvider>
        <FlowContent />
      </FlowStateProvider>
    </ThemeProvider>
  );
};
