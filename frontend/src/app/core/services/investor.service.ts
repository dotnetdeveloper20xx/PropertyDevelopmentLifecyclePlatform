import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { InvestorItem, CreateInvestorRequest, InvestorType, InvestorStatus } from '../models/investor.model';

@Injectable({ providedIn: 'root' })
export class InvestorService {
  private readonly investorsUrl = `${environment.apiUrl}/investors`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number; pageSize?: number; search?: string;
    type?: InvestorType; status?: InvestorStatus;
  }): Observable<ApiResponse<InvestorItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.type) httpParams = httpParams.set('type', params.type);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<ApiResponse<InvestorItem[]>>(this.investorsUrl, { params: httpParams });
  }

  create(request: CreateInvestorRequest): Observable<ApiResponse<InvestorItem>> {
    return this.http.post<ApiResponse<InvestorItem>>(this.investorsUrl, request);
  }
}
