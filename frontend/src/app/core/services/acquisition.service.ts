import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface AcquisitionRecord {
  id: string;
  opportunityId: string;
  purchasePrice: number;
  currency: string;
  completionDate: string;
  registryReference: string | null;
  status: AcquisitionStatus;
  solicitorName: string | null;
  solicitorContact: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateAcquisitionRequest {
  purchasePrice: number;
  currency?: string;
  completionDate: string;
  registryReference?: string;
  solicitorName?: string;
  solicitorContact?: string;
  notes?: string;
}

export type AcquisitionStatus = 'InProgress' | 'Completed' | 'Registered';

/**
 * API service for acquisition/completion records.
 */
@Injectable({ providedIn: 'root' })
export class AcquisitionService {
  private readonly baseUrl = `${environment.apiUrl}/opportunities`;

  constructor(private http: HttpClient) {}

  getByOpportunity(opportunityId: string): Observable<ApiResponse<AcquisitionRecord | null>> {
    return this.http.get<ApiResponse<AcquisitionRecord | null>>(
      `${this.baseUrl}/${opportunityId}/acquisition`
    );
  }

  create(opportunityId: string, request: CreateAcquisitionRequest): Observable<ApiResponse<AcquisitionRecord>> {
    return this.http.post<ApiResponse<AcquisitionRecord>>(
      `${this.baseUrl}/${opportunityId}/acquisition`, request
    );
  }
}
