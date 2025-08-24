import React, { useState } from 'react';
import { useTimelineState } from '../providers/TimelineStateProvider';
import { TaskCard } from '../display/TaskCard';
import { TaskModal } from '../display/TaskModal';
import { PhaseLabel } from '../display/PhaseLabel';

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

const phaseNumbers = {
  "Phase 1: Foundation & Legal Framework": "1",
  "Phase 2: Core Development & Demo Preparation": "2",
  "Phase 3: Advanced Features & User Testing": "3", 
  "Phase 4: Polish & Market Package": "4"
};

export const HorizontalTimelineLayout: React.FC = () => {
  const { phases, isLoading } = useTimelineState();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedTaskNumber, setSelectedTaskNumber] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task: any, taskNumber: string) => {
    setSelectedTask(task);
    setSelectedTaskNumber(taskNumber);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setSelectedTaskNumber('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading project timeline...</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Phase Connection Arrows */}
        <div className="hidden lg:flex absolute top-16 left-0 right-0 justify-between items-center px-6 z-0">
          {phaseOrder.slice(0, -1).map((_, index) => (
            <div key={index} className="flex-1 flex justify-end items-center px-8">
              <div className="flex items-center">
                <div className="h-0.5 bg-gray-300 flex-1 min-w-[50px]"></div>
                <svg className="w-4 h-4 text-gray-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Phase Headers with Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {phaseOrder.map((phaseName, phaseIndex) => {
            const tasks = phases[phaseName] || [];
            const colorClass = phaseColors[phaseName] || "border-t-gray-500";
            const phaseNum = phaseNumbers[phaseName] || (phaseIndex + 1).toString();
            
            return (
              <div key={phaseName} className={`flex flex-col bg-gray-50 rounded-lg border-t-4 ${colorClass} relative`}>
                {/* Phase Number Badge */}
                <div className="absolute -top-3 left-4 bg-white border-2 border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-700 z-20">
                  {phaseNum}
                </div>
                
                <div className="p-4 pb-2 pt-6">
                  <h2 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                    {phaseName.split(': ')[1] || phaseName}
                  </h2>
                  <div className="text-sm text-gray-600 mb-4">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="flex-1 px-4 pb-4">
                  <div className="space-y-2">
                    {tasks.length > 0 ? (
                      tasks.map((task: any, taskIndex: number) => {
                        const taskNumber = `${phaseNum}.${taskIndex + 1}`;
                        return (
                          <TaskCard 
                            key={task._id}
                            task={task} 
                            taskNumber={taskNumber}
                            onClick={() => handleTaskClick(task, taskNumber)}
                          />
                        );
                      })
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
      </div>

      {/* Task Detail Modal */}
      <TaskModal
        task={selectedTask}
        taskNumber={selectedTaskNumber}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};