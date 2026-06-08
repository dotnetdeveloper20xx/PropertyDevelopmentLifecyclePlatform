import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PortfolioItem, CreatePortfolioRequest, PortfolioStatus, RiskLevel } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly apiUrl = `${environment.apiUrl}/portfolios`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number; pageSize?: number; search?: string;
    status?: PortfolioStatus; riskLevel?: RiskLevel;
  }): Observable<ApiResponse<PortfolioItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.riskLevel) httpParams = httpParams.set('riskLevel', params.riskLevel);
    return this.http.get<ApiResponse<PortfolioItem[]>>(this.apiUrl, { params: httpParams });
  }

  create(request: CreatePortfolioRequest): Observable<ApiResponse<PortfolioItem>> {
    return this.http.post<ApiResponse<PortfolioItem>>(this.apiUrl, request);
  }
}
