export type DesignStageStatus = 'Draft' | 'InProgress' | 'UnderReview' | 'Approved' | 'Rejected' | 'Superseded';

export interface DesignPackageItem {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  discipline: string | null;
  consultant: string | null;
  status: DesignStageStatus;
  version: number;
  submittedDate: string | null;
  approvedDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateDesignPackageRequest {
  name: string;
  description?: string;
  discipline?: string;
  consultant?: string;
  notes?: string;
}
