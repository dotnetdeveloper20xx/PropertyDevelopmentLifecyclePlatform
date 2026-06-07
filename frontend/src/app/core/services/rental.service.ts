import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { TenancyItem, CreateTenancyRequest, TenancyStatus } from '../models/rental.model';

@Injectable({ providedIn: 'root' })
export class RentalService {
  private readonly tenanciesUrl = `${environment.apiUrl}/tenancies`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number; pageSize?: number; search?: string; status?: TenancyStatus;
  }): Observable<ApiResponse<TenancyItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<ApiResponse<TenancyItem[]>>(this.tenanciesUrl, { params: httpParams });
  }

  create(request: CreateTenancyRequest): Observable<ApiResponse<TenancyItem>> {
    return this.http.post<ApiResponse<TenancyItem>>(this.tenanciesUrl, request);
  }
}
