import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { UnitItem, CreateUnitRequest } from '../models/unit.model';

@Injectable({ providedIn: 'root' })
export class UnitService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByProject(projectId: string): Observable<ApiResponse<UnitItem[]>> {
    return this.http.get<ApiResponse<UnitItem[]>>(
      `${this.apiUrl}/projects/${projectId}/units`);
  }

  create(projectId: string, request: CreateUnitRequest): Observable<ApiResponse<UnitItem>> {
    return this.http.post<ApiResponse<UnitItem>>(
      `${this.apiUrl}/projects/${projectId}/units`, request);
  }
}
