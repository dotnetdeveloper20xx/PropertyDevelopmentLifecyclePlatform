import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  ConstructionStageItem, CreateStageRequest,
  InspectionItem, CreateInspectionRequest,
  SnagItem, CreateSnagRequest
} from '../models/construction.model';

@Injectable({ providedIn: 'root' })
export class ConstructionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStages(projectId: string): Observable<ApiResponse<ConstructionStageItem[]>> {
    return this.http.get<ApiResponse<ConstructionStageItem[]>>(`${this.apiUrl}/projects/${projectId}/construction-stages`);
  }

  createStage(projectId: string, request: CreateStageRequest): Observable<ApiResponse<ConstructionStageItem>> {
    return this.http.post<ApiResponse<ConstructionStageItem>>(`${this.apiUrl}/projects/${projectId}/construction-stages`, request);
  }

  getInspections(stageId: string): Observable<ApiResponse<InspectionItem[]>> {
    return this.http.get<ApiResponse<InspectionItem[]>>(`${this.apiUrl}/construction-stages/${stageId}/inspections`);
  }

  createInspection(stageId: string, request: CreateInspectionRequest): Observable<ApiResponse<InspectionItem>> {
    return this.http.post<ApiResponse<InspectionItem>>(`${this.apiUrl}/construction-stages/${stageId}/inspections`, request);
  }

  getSnags(stageId: string): Observable<ApiResponse<SnagItem[]>> {
    return this.http.get<ApiResponse<SnagItem[]>>(`${this.apiUrl}/construction-stages/${stageId}/snags`);
  }

  createSnag(stageId: string, request: CreateSnagRequest): Observable<ApiResponse<SnagItem>> {
    return this.http.post<ApiResponse<SnagItem>>(`${this.apiUrl}/construction-stages/${stageId}/snags`, request);
  }
}
