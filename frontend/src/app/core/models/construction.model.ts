export type ConstructionStageStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Delayed' | 'OnHold';
export type InspectionType = 'Foundation' | 'Structural' | 'Electrical' | 'Plumbing' | 'FireSafety' | 'Roofing' | 'Finishing' | 'External' | 'Snagging' | 'FinalHandover';
export type InspectionStatus = 'Scheduled' | 'InProgress' | 'Passed' | 'Failed' | 'RequiresReInspection';
export type SnagStatus = 'Open' | 'InProgress' | 'Resolved' | 'Verified';
export type SnagPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ConstructionStageItem {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  status: ConstructionStageStatus;
  sortOrder: number;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  actualStartDate: string | null;
  actualEndDate: string | null;
  progressPercent: number | null;
  notes: string | null;
  inspectionCount: number;
  snagCount: number;
  createdAt: string;
}

export interface CreateStageRequest {
  name: string;
  description?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  notes?: string;
}

export interface InspectionItem {
  id: string;
  constructionStageId: string;
  type: InspectionType;
  status: InspectionStatus;
  inspector: string | null;
  scheduledDate: string;
  completedDate: string | null;
  findings: string | null;
  defectsFound: number;
  notes: string | null;
  createdAt: string;
}

export interface CreateInspectionRequest {
  type: InspectionType;
  inspector?: string;
  scheduledDate: string;
  notes?: string;
}

export interface SnagItem {
  id: string;
  constructionStageId: string;
  inspectionId: string | null;
  title: string;
  description: string | null;
  location: string | null;
  status: SnagStatus;
  priority: SnagPriority;
  assignedTo: string | null;
  resolvedDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateSnagRequest {
  inspectionId?: string;
  title: string;
  description?: string;
  location?: string;
  priority: SnagPriority;
  assignedTo?: string;
  notes?: string;
}
