/**
 * Rental Management models matching backend DTOs.
 */

export type TenancyStatus = 'Active' | 'Pending' | 'Expired' | 'Terminated' | 'Renewed';
export type RentFrequency = 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';

export interface TenancyItem {
  id: string;
  unitId: string;
  unitReference: string | null;
  tenantName: string;
  tenantEmail: string | null;
  tenantPhone: string | null;
  status: TenancyStatus;
  rentAmount: number;
  currency: string;
  rentFrequency: RentFrequency;
  startDate: string;
  endDate: string | null;
  depositAmount: number | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateTenancyRequest {
  unitId: string;
  tenantName: string;
  tenantEmail?: string;
  tenantPhone?: string;
  rentAmount: number;
  currency?: string;
  rentFrequency: RentFrequency;
  startDate: string;
  endDate?: string;
  depositAmount?: number;
  notes?: string;
}
