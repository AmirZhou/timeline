import React, { useState } from 'react';
import { useTimelineState } from '../providers/TimelineStateProvider';
import { TimelineNode } from '../display/TimelineNode';
import { TaskModal } from '../display/TaskModal';

const phaseOrder = [
  "Phase 1: Foundation & Legal Framework",
  "Phase 2: Core Development & Demo Preparation", 
  "Phase 3: Advanced Features & User Testing",
  "Phase 4: Polish & Market Package"
];

export const VerticalTimelineLayout: React.FC = () => {
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

  // Split timeline items into two columns: Phases 1&2 left, Phases 3&4 right
  const leftColumnItems = timelineItems.filter((item) => {
    const phaseNum = parseInt(item.taskNumber.split('.')[0]);
    return phaseNum <= 2;
  });
  
  const rightColumnItems = timelineItems.filter((item) => {
    const phaseNum = parseInt(item.taskNumber.split('.')[0]);
    return phaseNum >= 3;
  });

  // Add phase spacing by detecting phase transitions
  const timelineItemsWithSpacing = timelineItems.map((item, index) => {
    const prevItem = index > 0 ? timelineItems[index - 1] : null;
    const currentPhase = parseInt(item.taskNumber.split('.')[0]);
    const prevPhase = prevItem ? parseInt(prevItem.taskNumber.split('.')[0]) : 0;
    const isNewPhase = currentPhase !== prevPhase;
    
    return {
      ...item,
      isNewPhase: isNewPhase && index > 0
    };
  });

  // Update filtered items with spacing info
  const leftColumnItemsWithSpacing = timelineItemsWithSpacing.filter((item) => {
    const phaseNum = parseInt(item.taskNumber.split('.')[0]);
    return phaseNum <= 2;
  });
  
  const rightColumnItemsWithSpacing = timelineItemsWithSpacing.filter((item) => {
    const phaseNum = parseInt(item.taskNumber.split('.')[0]);
    return phaseNum >= 3;
  });

  const TimelineColumn: React.FC<{ items: typeof timelineItemsWithSpacing, columnIndex: number }> = ({ items, columnIndex }) => (
    <div className="relative">
      {/* Vertical Line for this column */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white opacity-30"></div>
      
      {/* Timeline Items */}
      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={item.task._id}>
            {/* Add extra spacing before new phase */}
            {item.isNewPhase && (
              <div className="h-8"></div>
            )}
            <TimelineNode
              task={item.task}
              taskNumber={item.taskNumber}
              phaseTitle={item.phaseTitle}
              isPhaseStart={item.isPhaseStart}
              onClick={() => handleTaskClick(item.task, item.taskNumber)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const MobileTimeline: React.FC = () => (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white opacity-30"></div>
      
      {/* Timeline Items */}
      <div className="space-y-8">
        {timelineItemsWithSpacing.map((item, index) => (
          <div key={item.task._id}>
            {/* Add extra spacing before new phase */}
            {item.isNewPhase && (
              <div className="h-8"></div>
            )}
            <TimelineNode
              task={item.task}
              taskNumber={item.taskNumber}
              phaseTitle={item.phaseTitle}
              isPhaseStart={item.isPhaseStart}
              onClick={() => handleTaskClick(item.task, item.taskNumber)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Layout: Single Column */}
      <div className="block md:hidden max-w-4xl mx-auto py-8">
        <MobileTimeline />
        
        {/* Mobile Fail-Safe Indicator */}
        <div className="relative flex items-center ml-6 mt-12">
          <div className="absolute -left-6 w-4 h-4 bg-white transform rotate-45 border-2 border-gray-600"></div>
          <div className="ml-8 text-white font-mono text-sm tracking-wide">
            FAIL-SAFE
          </div>
        </div>
      </div>

      {/* Desktop Layout: Two Columns */}
      <div className="hidden md:block max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-2 gap-16">
          {/* Left Column: Phases 1-2 */}
          <TimelineColumn items={leftColumnItemsWithSpacing} columnIndex={0} />
          
          {/* Right Column: Phases 3-4 */}
          <TimelineColumn items={rightColumnItemsWithSpacing} columnIndex={1} />
        </div>
        
        {/* Desktop Centered Bottom Fail-Safe Indicator */}
        <div className="flex justify-center mt-12">
          <div className="relative flex items-center">
            <div className="w-4 h-4 bg-white transform rotate-45 border-2 border-gray-600"></div>
            <div className="ml-4 text-white font-mono text-sm tracking-wide">
              FAIL-SAFE
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