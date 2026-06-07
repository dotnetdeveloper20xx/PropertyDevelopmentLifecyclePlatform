import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  ProjectListItem, ProjectDetail, CreateProjectRequest, ProjectStatus,
  MilestoneItem, CreateMilestoneRequest,
  ProjectTaskItem, CreateProjectTaskRequest,
  ProjectRiskItem, CreateProjectRiskRequest
} from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAll(params?: { page?: number; pageSize?: number; search?: string; status?: ProjectStatus }): Observable<ApiResponse<ProjectListItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<ApiResponse<ProjectListItem[]>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<ProjectDetail>> {
    return this.http.get<ApiResponse<ProjectDetail>>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateProjectRequest): Observable<ApiResponse<{ id: string }>> {
    return this.http.post<ApiResponse<{ id: string }>>(this.apiUrl, request);
  }

  changeStatus(id: string, newStatus: ProjectStatus): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { newStatus });
  }

  // Milestones
  getMilestones(projectId: string): Observable<ApiResponse<MilestoneItem[]>> {
    return this.http.get<ApiResponse<MilestoneItem[]>>(`${this.apiUrl}/${projectId}/milestones`);
  }

  createMilestone(projectId: string, request: CreateMilestoneRequest): Observable<ApiResponse<MilestoneItem>> {
    return this.http.post<ApiResponse<MilestoneItem>>(`${this.apiUrl}/${projectId}/milestones`, request);
  }

  // Tasks
  getTasks(projectId: string): Observable<ApiResponse<ProjectTaskItem[]>> {
    return this.http.get<ApiResponse<ProjectTaskItem[]>>(`${this.apiUrl}/${projectId}/tasks`);
  }

  createTask(projectId: string, request: CreateProjectTaskRequest): Observable<ApiResponse<ProjectTaskItem>> {
    return this.http.post<ApiResponse<ProjectTaskItem>>(`${this.apiUrl}/${projectId}/tasks`, request);
  }

  // Risks
  getRisks(projectId: string): Observable<ApiResponse<ProjectRiskItem[]>> {
    return this.http.get<ApiResponse<ProjectRiskItem[]>>(`${this.apiUrl}/${projectId}/risks`);
  }

  createRisk(projectId: string, request: CreateProjectRiskRequest): Observable<ApiResponse<ProjectRiskItem>> {
    return this.http.post<ApiResponse<ProjectRiskItem>>(`${this.apiUrl}/${projectId}/risks`, request);
  }
}
