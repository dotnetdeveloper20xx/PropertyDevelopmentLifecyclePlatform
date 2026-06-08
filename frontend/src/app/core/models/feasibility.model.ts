export type FeasibilityStatus = 'Draft' | 'InProgress' | 'Completed' | 'Approved' | 'Rejected';

export interface FeasibilityItem {
  id: string;
  opportunityId: string;
  title: string;
  description: string | null;
  status: FeasibilityStatus;
  estimatedLandCost: number;
  estimatedBuildCost: number;
  professionalFees: number;
  financeCosts: number;
  grossDevelopmentValue: number;
  expectedRevenue: number;
  estimatedProfit: number;
  roi: number;
  assessedBy: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateFeasibilityRequest {
  title: string;
  description?: string;
  estimatedLandCost: number;
  estimatedBuildCost: number;
  professionalFees: number;
  financeCosts: number;
  grossDevelopmentValue: number;
  expectedRevenue: number;
  notes?: string;
}
