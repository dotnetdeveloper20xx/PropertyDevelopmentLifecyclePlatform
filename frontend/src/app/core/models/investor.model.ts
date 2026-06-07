/**
 * Investors & Funding models matching backend DTOs.
 */

export type InvestorType = 'Individual' | 'Corporate' | 'Institutional' | 'FamilyOffice' | 'Syndicate';
export type InvestorStatus = 'Active' | 'Prospective' | 'Inactive' | 'Exited';

export interface InvestorItem {
  id: string;
  name: string;
  type: InvestorType;
  status: InvestorStatus;
  email: string | null;
  phone: string | null;
  company: string | null;
  totalInvested: number;
  currency: string;
  projectCount: number;
  notes: string | null;
  createdAt: string;
}

export interface CreateInvestorRequest {
  name: string;
  type: InvestorType;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}
