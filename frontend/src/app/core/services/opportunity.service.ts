import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  CreateOpportunityRequest,
  OpportunityDetail,
  OpportunityListItem,
  OpportunityStats,
  OpportunityStatus
} from '../models/opportunity.model';

/**
 * API service for land acquisition opportunities.
 * One service per API resource. Returns typed observables.
 */
@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private readonly apiUrl = `${environment.apiUrl}/opportunities`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
    status?: OpportunityStatus;
  }): Observable<ApiResponse<OpportunityListItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortDir) httpParams = httpParams.set('sortDir', params.sortDir);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);

    return this.http.get<ApiResponse<OpportunityListItem[]>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<OpportunityDetail>> {
    return this.http.get<ApiResponse<OpportunityDetail>>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateOpportunityRequest): Observable<ApiResponse<{ id: string; name: string; status: string; createdAt: string }>> {
    return this.http.post<ApiResponse<{ id: string; name: string; status: string; createdAt: string }>>(this.apiUrl, request);
  }

  update(id: string, request: Partial<CreateOpportunityRequest>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { id, ...request });
  }

  changeStatus(id: string, newStatus: OpportunityStatus): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { newStatus });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<ApiResponse<OpportunityStats>> {
    return this.http.get<ApiResponse<OpportunityStats>>(`${this.apiUrl}/stats`);
  }
}
