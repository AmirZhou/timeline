import React, { useState, useMemo } from 'react';
import { useTimelineState } from '../providers/TimelineStateProvider';
import { TimelineNode } from '../display/TimelineNode';
import { TaskModal } from '../display/TaskModal';

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

  // Create timeline items from tasks using dynamic phase numbers
  const timelineItems = useMemo(() => {
    if (isLoading || !phases) {
      return [];
    }
    const items: Array<{
      task: any;
      taskNumber: string;
      phaseTitle: string;
      isPhaseStart: boolean;
      phaseNumber: number;
    }> = [];

    // Group all tasks by phase number
    const tasksByPhaseNumber: { [phaseNum: number]: any[] } = {};
    
    Object.values(phases).flat().forEach((task: any) => {
      const phaseNumber = task.properties.phaseNumber || 1; // Default to 1 if missing
      if (!tasksByPhaseNumber[phaseNumber]) {
        tasksByPhaseNumber[phaseNumber] = [];
      }
      tasksByPhaseNumber[phaseNumber].push(task);
    });

    // Sort phase numbers and create timeline items
    const sortedPhaseNumbers = Object.keys(tasksByPhaseNumber)
      .map(num => parseInt(num))
      .sort((a, b) => a - b);

    sortedPhaseNumbers.forEach((phaseNumber) => {
      const phaseTasks = tasksByPhaseNumber[phaseNumber];
      
      phaseTasks.forEach((task: any, taskIndex: number) => {
        const taskNumber = `${phaseNumber}.${taskIndex + 1}`;
        const phaseTitle = task.properties.phase?.split(': ')[1] || `Phase ${phaseNumber}`;
        
        items.push({
          task,
          taskNumber,
          phaseTitle,
          phaseNumber,
          isPhaseStart: taskIndex === 0
        });
      });
    });

    return items;
  }, [phases, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-gray-400">Loading project timeline...</span>
      </div>
    );
  }

  // Split timeline items into two columns: Phases 1&2 left, Phases 3+ right
  const leftColumnItems = timelineItems.filter((item) => {
    return item.phaseNumber <= 2;
  });
  
  const rightColumnItems = timelineItems.filter((item) => {
    return item.phaseNumber >= 3;
  });

  // Add phase spacing by detecting phase transitions
  const timelineItemsWithSpacing = timelineItems.map((item, index) => {
    const prevItem = index > 0 ? timelineItems[index - 1] : null;
    const currentPhase = item.phaseNumber;
    const prevPhase = prevItem ? prevItem.phaseNumber : 0;
    const isNewPhase = currentPhase !== prevPhase;
    
    return {
      ...item,
      isNewPhase: isNewPhase && index > 0
    };
  });

  // Update filtered items with spacing info
  const leftColumnItemsWithSpacing = timelineItemsWithSpacing.filter((item) => {
    return item.phaseNumber <= 2;
  });
  
  const rightColumnItemsWithSpacing = timelineItemsWithSpacing.filter((item) => {
    return item.phaseNumber >= 3;
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
        
      </div>

      {/* Desktop Layout: Two Columns */}
      <div className="hidden md:block max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-2 gap-16">
          {/* Left Column: Phases 1-2 */}
          <TimelineColumn items={leftColumnItemsWithSpacing} columnIndex={0} />
          
          {/* Right Column: Phases 3-4 */}
          <TimelineColumn items={rightColumnItemsWithSpacing} columnIndex={1} />
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