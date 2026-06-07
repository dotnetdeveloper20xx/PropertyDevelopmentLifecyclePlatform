import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  CreatePlanningApplicationRequest,
  UpdatePlanningApplicationRequest,
  PlanningApplicationDetail,
  PlanningApplicationListItem,
  PlanningApplicationStatus,
  PlanningCondition,
  CreateConditionRequest,
  DischargeConditionRequest,
  PlanningAppeal,
  CreateAppealRequest
} from '../models/planning.model';

/**
 * API service for planning applications.
 */
@Injectable({ providedIn: 'root' })
export class PlanningApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/planning-applications`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
    status?: PlanningApplicationStatus;
    opportunityId?: string;
  }): Observable<ApiResponse<PlanningApplicationListItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortDir) httpParams = httpParams.set('sortDir', params.sortDir);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.opportunityId) httpParams = httpParams.set('opportunityId', params.opportunityId);

    return this.http.get<ApiResponse<PlanningApplicationListItem[]>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<PlanningApplicationDetail>> {
    return this.http.get<ApiResponse<PlanningApplicationDetail>>(`${this.apiUrl}/${id}`);
  }

  create(request: CreatePlanningApplicationRequest): Observable<ApiResponse<{ id: string }>> {
    return this.http.post<ApiResponse<{ id: string }>>(this.apiUrl, request);
  }

  update(id: string, request: UpdatePlanningApplicationRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  changeStatus(id: string, newStatus: PlanningApplicationStatus): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { newStatus });
  }

  // Conditions
  getConditions(applicationId: string): Observable<ApiResponse<PlanningCondition[]>> {
    return this.http.get<ApiResponse<PlanningCondition[]>>(`${this.apiUrl}/${applicationId}/conditions`);
  }

  createCondition(applicationId: string, request: CreateConditionRequest): Observable<ApiResponse<PlanningCondition>> {
    return this.http.post<ApiResponse<PlanningCondition>>(`${this.apiUrl}/${applicationId}/conditions`, request);
  }

  dischargeCondition(applicationId: string, conditionId: string, request: DischargeConditionRequest): Observable<ApiResponse<PlanningCondition>> {
    return this.http.patch<ApiResponse<PlanningCondition>>(
      `${this.apiUrl}/${applicationId}/conditions/${conditionId}/discharge`, request);
  }

  // Appeals
  getAppeals(applicationId: string): Observable<ApiResponse<PlanningAppeal[]>> {
    return this.http.get<ApiResponse<PlanningAppeal[]>>(`${this.apiUrl}/${applicationId}/appeals`);
  }

  createAppeal(applicationId: string, request: CreateAppealRequest): Observable<ApiResponse<PlanningAppeal>> {
    return this.http.post<ApiResponse<PlanningAppeal>>(`${this.apiUrl}/${applicationId}/appeals`, request);
  }

  changeAppealStatus(applicationId: string, appealId: string, newStatus: string): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${applicationId}/appeals/${appealId}/status`, { newStatus });
  }
}
