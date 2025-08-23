import React from 'react';
import { useFlowState } from '../providers/FlowStateProvider';
import { TaskCard } from '../display/TaskCard';
import { StageLabel } from '../display/StageLabel';

const phaseOrder = [
  "Phase 1: Foundation & Legal Framework",
  "Phase 2: Core Development & Demo Preparation", 
  "Phase 3: Advanced Features & User Testing",
  "Phase 4: Polish & Market Package"
];

const phaseColors = {
  "Phase 1: Foundation & Legal Framework": "border-t-blue-500",
  "Phase 2: Core Development & Demo Preparation": "border-t-green-500",
  "Phase 3: Advanced Features & User Testing": "border-t-orange-500", 
  "Phase 4: Polish & Market Package": "border-t-purple-500"
};

export const HorizontalFlowLayout: React.FC = () => {
  const { phases, isLoading } = useFlowState();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading project timeline...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
      {phaseOrder.map(phaseName => {
        const tasks = phases[phaseName] || [];
        const colorClass = phaseColors[phaseName] || "border-t-gray-500";
        
        return (
          <div key={phaseName} className={`flex flex-col bg-gray-50 rounded-lg border-t-4 ${colorClass}`}>
            <div className="p-4 pb-2">
              <h2 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                {phaseName.split(': ')[1] || phaseName}
              </h2>
              <div className="text-sm text-gray-600 mb-4">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex-1 px-4 pb-4">
              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task: any) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-gray-400 mb-2">📋</div>
                    <p className="text-sm">No tasks found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
