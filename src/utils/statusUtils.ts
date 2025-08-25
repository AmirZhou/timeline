import { StatusDetails } from '../types/task';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completed':
      return 'text-green-400';
    case 'In Progress':
      return 'text-yellow-400';
    case 'Not Started':
    default:
      return 'text-red-400';
  }
};

export const getStatusDetails = (status: string): StatusDetails => {
  switch (status) {
    case 'Completed':
      return {
        dotColor: 'bg-green-400'
      };
    case 'In Progress':
      return {
        dotColor: 'bg-yellow-400'
      };
    case 'Not Started':
    default:
      return {
        dotColor: 'bg-red-400'
      };
  }
};