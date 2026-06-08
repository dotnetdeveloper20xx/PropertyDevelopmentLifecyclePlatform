import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { FeasibilityItem, CreateFeasibilityRequest } from '../models/feasibility.model';

@Injectable({ providedIn: 'root' })
export class FeasibilityService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByOpportunity(opportunityId: string): Observable<ApiResponse<FeasibilityItem[]>> {
    return this.http.get<ApiResponse<FeasibilityItem[]>>(
      `${this.apiUrl}/opportunities/${opportunityId}/feasibility`
    );
  }

  create(opportunityId: string, request: CreateFeasibilityRequest): Observable<ApiResponse<FeasibilityItem>> {
    return this.http.post<ApiResponse<FeasibilityItem>>(
      `${this.apiUrl}/opportunities/${opportunityId}/feasibility`, request
    );
  }
}
