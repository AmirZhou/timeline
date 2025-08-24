import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { FlowStateProvider } from './providers/FlowStateProvider';
import { FlowContainer } from './layout/FlowContainer';
import { HorizontalFlowLayout } from './layout/HorizontalFlowLayout';
import { HeaderTitle } from './display/HeaderTitle';
import { HeaderSubtitle } from './display/HeaderSubtitle';
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
