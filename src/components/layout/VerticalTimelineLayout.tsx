import React, { useState } from 'react';
import { useFlowState } from '../providers/FlowStateProvider';
import { TimelineNode } from '../display/TimelineNode';
import { TaskModal } from '../display/TaskModal';

const phaseOrder = [
  "Phase 1: Foundation & Legal Framework",
  "Phase 2: Core Development & Demo Preparation", 
  "Phase 3: Advanced Features & User Testing",
  "Phase 4: Polish & Market Package"
];

export const VerticalTimelineLayout: React.FC = () => {
  const { phases, isLoading } = useFlowState();
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-gray-400">Loading project timeline...</span>
      </div>
    );
  }

  // Flatten all tasks into a single timeline
  const timelineItems: Array<{
    task: any;
    taskNumber: string;
    phaseTitle: string;
    isPhaseStart: boolean;
  }> = [];

  phaseOrder.forEach((phaseName, phaseIndex) => {
    const tasks = phases[phaseName] || [];
    const phaseNum = phaseIndex + 1;
    
    tasks.forEach((task: any, taskIndex: number) => {
      const taskNumber = `${phaseNum}.${taskIndex + 1}`;
      timelineItems.push({
        task,
        taskNumber,
        phaseTitle: phaseName.split(': ')[1] || phaseName,
        isPhaseStart: taskIndex === 0
      });
    });
  });

  return (
    <>
      <div className="max-w-4xl mx-auto py-8">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white opacity-30"></div>
          
          {/* Timeline Items */}
          <div className="space-y-8">
            {timelineItems.map((item, index) => (
              <TimelineNode
                key={item.task._id}
                task={item.task}
                taskNumber={item.taskNumber}
                phaseTitle={item.phaseTitle}
                isPhaseStart={item.isPhaseStart}
                onClick={() => handleTaskClick(item.task, item.taskNumber)}
              />
            ))}
            
            {/* Bottom Fail-Safe Indicator */}
            <div className="relative flex items-center ml-6">
              <div className="absolute -left-6 w-4 h-4 bg-white transform rotate-45 border-2 border-gray-600"></div>
              <div className="ml-8 text-white font-mono text-sm tracking-wide">
                FAIL-SAFE
              </div>
            </div>
          </div>
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