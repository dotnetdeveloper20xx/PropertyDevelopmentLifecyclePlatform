export type ProjectStatus = 'Planning' | 'PreConstruction' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';
export type MilestoneStatus = 'Upcoming' | 'InProgress' | 'Completed' | 'Overdue' | 'Cancelled';
export type ProjectTaskStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Blocked' | 'Cancelled';
export type ProjectTaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskStatus = 'Open' | 'Mitigating' | 'Resolved' | 'Accepted' | 'Closed';
export type RiskImpact = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskProbability = 'Low' | 'Medium' | 'High' | 'VeryHigh';

export interface ProjectListItem {
  id: string;
  opportunityId: string;
  name: string;
  projectReference: string;
  status: ProjectStatus;
  projectManager: string | null;
  startDate: string | null;
  targetEndDate: string | null;
  budget: number | null;
  progressPercent: number | null;
  totalUnits: number | null;
  milestoneCount: number;
  taskCount: number;
  riskCount: number;
  createdAt: string;
}

export interface ProjectDetail {
  id: string;
  opportunityId: string;
  opportunityName: string;
  name: string;
  description: string | null;
  projectReference: string;
  status: ProjectStatus;
  projectManager: string | null;
  siteAddress: string | null;
  startDate: string | null;
  targetEndDate: string | null;
  actualEndDate: string | null;
  budget: number | null;
  actualCost: number | null;
  totalUnits: number | null;
  progressPercent: number | null;
  notes: string | null;
  milestoneCount: number;
  taskCount: number;
  riskCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

export interface CreateProjectRequest {
  opportunityId: string;
  name: string;
  description?: string;
  projectReference: string;
  projectManager?: string;
  siteAddress?: string;
  startDate?: string;
  targetEndDate?: string;
  budget?: number;
  totalUnits?: number;
  notes?: string;
}

export interface MilestoneItem {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  targetDate: string;
  completedDate: string | null;
  sortOrder: number;
  notes: string | null;
  createdAt: string;
}

export interface CreateMilestoneRequest {
  title: string;
  description?: string;
  targetDate: string;
  notes?: string;
}

export interface ProjectTaskItem {
  id: string;
  projectId: string;
  milestoneId: string | null;
  title: string;
  description: string | null;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  assignedTo: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  progressPercent: number | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateProjectTaskRequest {
  milestoneId?: string;
  title: string;
  description?: string;
  priority: ProjectTaskPriority;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
}

export interface ProjectRiskItem {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: RiskStatus;
  impact: RiskImpact;
  probability: RiskProbability;
  mitigationPlan: string | null;
  owner: string | null;
  identifiedDate: string | null;
  resolvedDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateProjectRiskRequest {
  title: string;
  description?: string;
  impact: RiskImpact;
  probability: RiskProbability;
  mitigationPlan?: string;
  owner?: string;
  notes?: string;
}
