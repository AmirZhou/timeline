export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-900/20 text-red-400 border-red-800';
    case 'High':
      return 'bg-orange-900/20 text-orange-400 border-orange-800';
    case 'Medium':
      return 'bg-yellow-900/20 text-yellow-400 border-yellow-800';
    case 'Low':
      return 'bg-green-900/20 text-green-400 border-green-800';
    default:
      return 'bg-gray-900/20 text-gray-400 border-gray-800';
  }
};