export interface NotionTask {
  _id: string;
  title: string;
  properties: {
    status: "Not Started" | "In Progress" | "Completed";
    priority: "Critical" | "High" | "Medium" | "Low";
    assignee?: string;
    description: string;
    week: number;
    phase: string;
  };
  url: string;
}

export interface TaskModalProps {
  task: NotionTask | null;
  isOpen: boolean;
  onClose: () => void;
  taskNumber?: string;
}

export interface StatusDetails {
  dotColor: string;
}

export interface AssigneeDetails {
  display: string;
  description: string;
  initials: string;
  color: string;
}