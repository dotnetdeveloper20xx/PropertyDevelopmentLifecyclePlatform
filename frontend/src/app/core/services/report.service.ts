import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ReportItem, CreateReportRequest } from '../models/report.model';

/**
 * API service for the Reports & Dashboards module (Module 14).
 * Manages report definitions, generation, and retrieval.
 */
@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Observable<ApiResponse<ReportItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiResponse<ReportItem[]>>(this.apiUrl, { params: httpParams });
  }

  create(request: CreateReportRequest): Observable<ApiResponse<ReportItem>> {
    return this.http.post<ApiResponse<ReportItem>>(this.apiUrl, request);
  }
}
