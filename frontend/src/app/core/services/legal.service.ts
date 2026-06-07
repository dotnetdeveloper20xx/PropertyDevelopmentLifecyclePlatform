import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  ContractListItem, ContractDetail, CreateContractRequest, ContractStatus, ContractType,
  ComplianceCheckItem, CreateComplianceCheckRequest,
  LegalTaskItem, CreateLegalTaskRequest, LegalTaskStatus, LegalTaskPriority
} from '../models/legal.model';

@Injectable({ providedIn: 'root' })
export class LegalService {
  private readonly contractsUrl = `${environment.apiUrl}/contracts`;
  private readonly tasksUrl = `${environment.apiUrl}/legal-tasks`;

  constructor(private http: HttpClient) {}

  // Contracts
  getContracts(params?: {
    page?: number; pageSize?: number; search?: string;
    status?: ContractStatus; contractType?: ContractType; opportunityId?: string;
  }): Observable<ApiResponse<ContractListItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.contractType) httpParams = httpParams.set('contractType', params.contractType);
    if (params?.opportunityId) httpParams = httpParams.set('opportunityId', params.opportunityId);
    return this.http.get<ApiResponse<ContractListItem[]>>(this.contractsUrl, { params: httpParams });
  }

  getContractById(id: string): Observable<ApiResponse<ContractDetail>> {
    return this.http.get<ApiResponse<ContractDetail>>(`${this.contractsUrl}/${id}`);
  }

  createContract(request: CreateContractRequest): Observable<ApiResponse<{ id: string }>> {
    return this.http.post<ApiResponse<{ id: string }>>(this.contractsUrl, request);
  }

  changeContractStatus(id: string, newStatus: ContractStatus): Observable<void> {
    return this.http.patch<void>(`${this.contractsUrl}/${id}/status`, { newStatus });
  }

  // Compliance Checks
  getComplianceChecks(opportunityId: string): Observable<ApiResponse<ComplianceCheckItem[]>> {
    return this.http.get<ApiResponse<ComplianceCheckItem[]>>(
      `${environment.apiUrl}/opportunities/${opportunityId}/compliance-checks`);
  }

  createComplianceCheck(opportunityId: string, request: CreateComplianceCheckRequest): Observable<ApiResponse<ComplianceCheckItem>> {
    return this.http.post<ApiResponse<ComplianceCheckItem>>(
      `${environment.apiUrl}/opportunities/${opportunityId}/compliance-checks`, request);
  }

  changeComplianceStatus(opportunityId: string, checkId: string, body: { newStatus: string; outcome?: string; riskLevel?: string }): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/opportunities/${opportunityId}/compliance-checks/${checkId}/status`, body);
  }

  // Legal Tasks
  getLegalTasks(params?: {
    page?: number; pageSize?: number; search?: string;
    status?: LegalTaskStatus; priority?: LegalTaskPriority;
    contractId?: string; opportunityId?: string;
  }): Observable<ApiResponse<LegalTaskItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.priority) httpParams = httpParams.set('priority', params.priority);
    if (params?.contractId) httpParams = httpParams.set('contractId', params.contractId);
    if (params?.opportunityId) httpParams = httpParams.set('opportunityId', params.opportunityId);
    return this.http.get<ApiResponse<LegalTaskItem[]>>(this.tasksUrl, { params: httpParams });
  }

  createLegalTask(request: CreateLegalTaskRequest): Observable<ApiResponse<LegalTaskItem>> {
    return this.http.post<ApiResponse<LegalTaskItem>>(this.tasksUrl, request);
  }

  changeLegalTaskStatus(id: string, newStatus: LegalTaskStatus): Observable<void> {
    return this.http.patch<void>(`${this.tasksUrl}/${id}/status`, { newStatus });
  }
}
