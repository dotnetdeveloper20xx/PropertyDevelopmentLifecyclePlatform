import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { SalesLeadItem, CreateSalesLeadRequest, LeadStatus } from '../models/sales.model';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly salesUrl = `${environment.apiUrl}/sales-leads`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number; pageSize?: number; search?: string; status?: LeadStatus;
  }): Observable<ApiResponse<SalesLeadItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<ApiResponse<SalesLeadItem[]>>(this.salesUrl, { params: httpParams });
  }

  create(request: CreateSalesLeadRequest): Observable<ApiResponse<SalesLeadItem>> {
    return this.http.post<ApiResponse<SalesLeadItem>>(this.salesUrl, request);
  }
}
