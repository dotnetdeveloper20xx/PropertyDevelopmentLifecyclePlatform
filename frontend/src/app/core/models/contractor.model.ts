/**
 * Contractors & Suppliers models matching backend DTOs.
 */

export type ContractorType = 'MainContractor' | 'Subcontractor' | 'Consultant' | 'Supplier' | 'Specialist';
export type ContractorStatus = 'Active' | 'Preferred' | 'OnHold' | 'Blacklisted' | 'Inactive';

export interface ContractorItem {
  id: string;
  companyName: string;
  type: ContractorType;
  status: ContractorStatus;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  trade: string | null;
  rating: number | null;
  insuranceDetails: string | null;
  insuranceExpiry: string | null;
  certifications: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateContractorRequest {
  companyName: string;
  type: ContractorType;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  trade?: string;
  insuranceDetails?: string;
  insuranceExpiry?: string;
  certifications?: string;
  notes?: string;
}
