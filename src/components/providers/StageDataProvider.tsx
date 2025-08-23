import React, { createContext, useContext } from 'react';

export interface Substep {
  id: string;
  number: string;
  text: string;
  complete: boolean;
}

export interface Stage {
  id: string;
  name: string;
  icon: 'play' | 'verify' | 'unlock' | 'download' | 'install';
  substeps: Substep[];
  complete: boolean;
}

const stageData: Stage[] = [
  {
    id: 'enter-site',
    name: 'Enter Site',
    icon: 'play',
    complete: false,
    substeps: [
      { id: '1.1', number: '1.1', text: 'Navigate to unlock portal', complete: false },
      { id: '1.2', number: '1.2', text: 'Accept terms and conditions', complete: false },
      { id: '1.3', number: '1.3', text: 'Initialize connection protocol', complete: false },
    ]
  },
  {
    id: 'verify',
    name: 'Verify',
    icon: 'verify',
    complete: false,
    substeps: [
      { id: '2.1', number: '2.1', text: 'Authenticate device signature', complete: false },
      { id: '2.2', number: '2.2', text: 'Validate security certificates', complete: false },
      { id: '2.3', number: '2.3', text: 'Confirm user permissions', complete: false },
    ]
  },
  {
    id: 'unlock',
    name: 'Unlock',
    icon: 'unlock',
    complete: false,
    substeps: [
      { id: '3.1', number: '3.1', text: 'Generate unlock keys', complete: false },
      { id: '3.2', number: '3.2', text: 'Apply security patches', complete: false },
      { id: '3.3', number: '3.3', text: 'Remove restrictions', complete: false },
    ]
  },
  {
    id: 'download',
    name: 'Download',
    icon: 'download',
    complete: false,
    substeps: [
      { id: '4.1', number: '4.1', text: 'Prepare installation package', complete: false },
      { id: '4.2', number: '4.2', text: 'Download required files', complete: false },
      { id: '4.3', number: '4.3', text: 'Verify file integrity', complete: false },
    ]
  },
  {
    id: 'install',
    name: 'Install',
    icon: 'install',
    complete: false,
    substeps: [
      { id: '5.1', number: '5.1', text: 'Execute installation script', complete: false },
      { id: '5.2', number: '5.2', text: 'Configure system settings', complete: false },
      { id: '5.3', number: '5.3', text: 'Finalize setup process', complete: false },
    ]
  },
];

const StageDataContext = createContext<Stage[]>(stageData);

interface StageDataProviderProps {
  children: React.ReactNode;
}

export const StageDataProvider: React.FC<StageDataProviderProps> = ({ children }) => {
  return (
    <StageDataContext.Provider value={stageData}>
      {children}
    </StageDataContext.Provider>
  );
};

export const useStageData = () => useContext(StageDataContext);
