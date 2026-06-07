import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface DueDiligenceListItem {
  id: string;
  opportunityId: string;
  type: DueDiligenceType;
  status: DueDiligenceStatus;
  assignedTo: string | null;
  riskLevel: string | null;
  reportDate: string | null;
  createdAt: string;
}

export interface CreateDueDiligenceRequest {
  type: DueDiligenceType;
  assignedTo?: string;
  notes?: string;
}

export interface UpdateDueDiligenceRequest {
  status: DueDiligenceStatus;
  findings?: string;
  recommendation?: string;
  riskLevel?: string;
  reportDate?: string;
  notes?: string;
}

export type DueDiligenceType = 'Legal' | 'Environmental' | 'Planning' | 'Utilities' | 'Valuation';
export type DueDiligenceStatus = 'Pending' | 'InProgress' | 'Completed' | 'Failed';

/**
 * API service for due diligence operations (sub-resource of opportunities).
 */
@Injectable({ providedIn: 'root' })
export class DueDiligenceService {
  private readonly baseUrl = `${environment.apiUrl}/opportunities`;

  constructor(private http: HttpClient) {}

  getByOpportunity(opportunityId: string): Observable<ApiResponse<DueDiligenceListItem[]>> {
    return this.http.get<ApiResponse<DueDiligenceListItem[]>>(
      `${this.baseUrl}/${opportunityId}/due-diligences`
    );
  }

  create(opportunityId: string, request: CreateDueDiligenceRequest): Observable<ApiResponse<DueDiligenceListItem>> {
    return this.http.post<ApiResponse<DueDiligenceListItem>>(
      `${this.baseUrl}/${opportunityId}/due-diligences`, request
    );
  }

  update(opportunityId: string, id: string, request: UpdateDueDiligenceRequest): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${opportunityId}/due-diligences/${id}`, request
    );
  }
}
