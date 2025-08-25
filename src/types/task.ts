export interface NotionTask {
  _id: string;
  title: string;
  properties: {
    week?: number;
    phase?: string;
    phaseNumber?: number;
    status?: "Not Started" | "In Progress" | "In Review" | "Completed" | "Blocked";
    priority?: "Critical" | "High" | "Medium" | "Low";
    assignee?: string;
    category?: string[];
    description?: string;
    successCriteria?: string;
    dependencies?: string;
    risks?: string;
    dueDate?: string;
    reference?: string;
  };
  url: string;
  notionId: string;
  lastModified: number;
  createdTime: number;
  isArchived: boolean;
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