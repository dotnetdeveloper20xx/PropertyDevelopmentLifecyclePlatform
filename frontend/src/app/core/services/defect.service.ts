import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DefectItem, CreateDefectRequest, DefectStatus, DefectPriority } from '../models/defect.model';

@Injectable({ providedIn: 'root' })
export class DefectService {
  private readonly apiUrl = `${environment.apiUrl}/defects`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number; pageSize?: number; search?: string;
    status?: DefectStatus; priority?: DefectPriority;
  }): Observable<ApiResponse<DefectItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.priority) httpParams = httpParams.set('priority', params.priority);
    return this.http.get<ApiResponse<DefectItem[]>>(this.apiUrl, { params: httpParams });
  }

  create(request: CreateDefectRequest): Observable<ApiResponse<DefectItem>> {
    return this.http.post<ApiResponse<DefectItem>>(this.apiUrl, request);
  }
}
