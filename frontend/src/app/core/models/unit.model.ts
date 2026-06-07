/**
 * Property Units models matching backend DTOs.
 */

export type UnitType = 'Apartment' | 'House' | 'Penthouse' | 'Studio' | 'Duplex' | 'Townhouse' | 'Commercial' | 'Parking';
export type UnitStatus = 'Available' | 'Reserved' | 'Sold' | 'UnderOffer' | 'Exchanged' | 'Completed' | 'Rented' | 'Unavailable';

export interface UnitItem {
  id: string;
  projectId: string;
  reference: string;
  type: UnitType;
  floor: number | null;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number | null;
  price: number;
  currency: string;
  status: UnitStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateUnitRequest {
  reference: string;
  type: UnitType;
  floor?: number;
  bedrooms: number;
  bathrooms?: number;
  areaSqFt?: number;
  price: number;
  currency?: string;
  notes?: string;
}
