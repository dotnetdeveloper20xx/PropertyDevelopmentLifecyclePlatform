export type DefectStatus = 'Open' | 'InProgress' | 'Resolved' | 'Verified' | 'Closed' | 'Rejected';
export type DefectPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface DefectItem {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  unitReference: string | null;
  projectId: string | null;
  status: DefectStatus;
  priority: DefectPriority;
  reportedBy: string | null;
  assignedTo: string | null;
  reportedDate: string;
  resolvedDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateDefectRequest {
  title: string;
  description?: string;
  location?: string;
  unitReference?: string;
  projectId?: string;
  priority: DefectPriority;
  assignedTo?: string;
  notes?: string;
}
