/**
 * Opportunity models matching backend DTOs.
 */

export type OpportunityStatus =
  | 'Identified'
  | 'InitialReview'
  | 'DueDiligence'
  | 'OfferMade'
  | 'UnderContract'
  | 'Acquired'
  | 'Withdrawn';

export interface OpportunityListItem {
  id: string;
  name: string;
  location: string;
  landSize: number;
  landSizeUnit: string;
  status: OpportunityStatus;
  askingPrice: number | null;
  roi: number | null;
  source: string | null;
  expectedAcquisitionDate: string | null;
  createdAt: string;
}

export interface OpportunityDetail {
  id: string;
  name: string;
  location: string;
  address: string | null;
  postCode: string | null;
  landSize: number;
  landSizeUnit: string;
  currentUse: string | null;
  titleNumber: string | null;
  planningStatus: string | null;
  localPlanZoning: string | null;
  planningPotential: string | null;
  status: OpportunityStatus;
  source: string | null;
  agentName: string | null;
  agentContact: string | null;
  askingPrice: number | null;
  estimatedValue: number | null;
  estimatedDevelopmentCost: number | null;
  estimatedProfit: number | null;
  roi: number | null;
  expectedAcquisitionDate: string | null;
  notes: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  landOwnerId: string | null;
  landOwnerName: string | null;
  dueDiligenceCount: number;
  offerCount: number;
  documentCount: number;
}

export interface CreateOpportunityRequest {
  name: string;
  location: string;
  landSize: number;
  landSizeUnit?: string;
  address?: string;
  postCode?: string;
  currentUse?: string;
  source?: string;
  agentName?: string;
  askingPrice?: number;
  estimatedValue?: number;
  notes?: string;
}

export interface OpportunityStats {
  totalOpportunities: number;
  identified: number;
  initialReview: number;
  dueDiligence: number;
  offerMade: number;
  underContract: number;
  acquired: number;
  withdrawn: number;
  totalPipelineValue: number;
  averageAskingPrice: number | null;
}
