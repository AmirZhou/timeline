import React, { createContext, useContext } from 'react';

export interface PhaseTask {
  id: string;
  number: string;
  text: string;
  complete: boolean;
}

export interface Phase {
  id: string;
  name: string;
  icon: 'play' | 'verify' | 'unlock' | 'download' | 'install';
  tasks: PhaseTask[];
  complete: boolean;
}

const phaseData: Phase[] = [
  {
    id: 'foundation',
    name: 'Foundation & Legal Framework',
    icon: 'play',
    complete: false,
    tasks: [
      { id: '1.1', number: '1.1', text: 'Research legal requirements', complete: false },
      { id: '1.2', number: '1.2', text: 'Set up legal structure', complete: false },
      { id: '1.3', number: '1.3', text: 'Obtain necessary licenses', complete: false },
    ]
  },
  {
    id: 'verification',
    name: 'Verification & Compliance',
    icon: 'verify',
    complete: false,
    tasks: [
      { id: '2.1', number: '2.1', text: 'Authenticate compliance documentation', complete: false },
      { id: '2.2', number: '2.2', text: 'Validate regulatory requirements', complete: false },
      { id: '2.3', number: '2.3', text: 'Confirm operational permissions', complete: false },
    ]
  },
  {
    id: 'implementation',
    name: 'Implementation & Setup',
    icon: 'unlock',
    complete: false,
    tasks: [
      { id: '3.1', number: '3.1', text: 'Develop core systems', complete: false },
      { id: '3.2', number: '3.2', text: 'Implement security protocols', complete: false },
      { id: '3.3', number: '3.3', text: 'Configure operational framework', complete: false },
    ]
  },
  {
    id: 'deployment',
    name: 'Deployment & Distribution',
    icon: 'download',
    complete: false,
    tasks: [
      { id: '4.1', number: '4.1', text: 'Prepare deployment package', complete: false },
      { id: '4.2', number: '4.2', text: 'Deploy to production environment', complete: false },
      { id: '4.3', number: '4.3', text: 'Verify system integrity', complete: false },
    ]
  },
  {
    id: 'finalization',
    name: 'Finalization & Launch',
    icon: 'install',
    complete: false,
    tasks: [
      { id: '5.1', number: '5.1', text: 'Execute launch procedures', complete: false },
      { id: '5.2', number: '5.2', text: 'Configure operational settings', complete: false },
      { id: '5.3', number: '5.3', text: 'Complete project finalization', complete: false },
    ]
  },
];

const PhaseDataContext = createContext<Phase[]>(phaseData);

interface PhaseDataProviderProps {
  children: React.ReactNode;
}

export const PhaseDataProvider: React.FC<PhaseDataProviderProps> = ({ children }) => {
  return (
    <PhaseDataContext.Provider value={phaseData}>
      {children}
    </PhaseDataContext.Provider>
  );
};

export const usePhaseData = () => useContext(PhaseDataContext);