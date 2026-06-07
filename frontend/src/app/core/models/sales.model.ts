/**
 * Sales & Conveyancing models matching backend DTOs.
 */

export type LeadSource = 'Website' | 'Referral' | 'Agent' | 'Advertisement' | 'WalkIn' | 'Portal' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Viewing' | 'Offer' | 'Reserved' | 'Exchanged' | 'Completed' | 'Lost';

export interface SalesLeadItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: LeadSource;
  status: LeadStatus;
  interestedUnitId: string | null;
  interestedUnitRef: string | null;
  budget: number | null;
  currency: string;
  assignedTo: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateSalesLeadRequest {
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  interestedUnitId?: string;
  budget?: number;
  currency?: string;
  notes?: string;
}
