import { AssigneeDetails } from '../types/task';

export const getAssigneeColor = (assignee?: string): string => {
  if (!assignee) return 'text-gray-400';
  
  const colors = [
    'text-cyan-400',
    'text-purple-400',
    'text-green-400',
    'text-yellow-400',
    'text-pink-400',
    'text-blue-400'
  ];
  
  let hash = 0;
  for (let i = 0; i < assignee.length; i++) {
    hash = assignee.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export const getAssigneeInitials = (assignee?: string): string => {
  if (!assignee) return '??';
  
  const names = assignee.split(' ');
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  }
  return assignee.substring(0, 2).toUpperCase();
};

export const getAssigneeDetails = (assignee?: string): AssigneeDetails => {
  if (!assignee) {
    return {
      display: 'Unassigned',
      description: 'This task has not been assigned to a developer yet.',
      initials: '??',
      color: 'text-gray-400'
    };
  }
  
  return {
    display: assignee,
    description: `This task is assigned to ${assignee}`,
    initials: getAssigneeInitials(assignee),
    color: getAssigneeColor(assignee)
  };
};