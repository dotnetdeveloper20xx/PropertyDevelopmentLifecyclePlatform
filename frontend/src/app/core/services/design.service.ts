import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DesignPackageItem, CreateDesignPackageRequest } from '../models/design.model';

@Injectable({ providedIn: 'root' })
export class DesignService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByProject(projectId: string): Observable<ApiResponse<DesignPackageItem[]>> {
    return this.http.get<ApiResponse<DesignPackageItem[]>>(
      `${this.apiUrl}/projects/${projectId}/design-packages`
    );
  }

  create(projectId: string, request: CreateDesignPackageRequest): Observable<ApiResponse<DesignPackageItem>> {
    return this.http.post<ApiResponse<DesignPackageItem>>(
      `${this.apiUrl}/projects/${projectId}/design-packages`, request
    );
  }
}
