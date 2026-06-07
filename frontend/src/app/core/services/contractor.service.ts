import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ContractorItem, CreateContractorRequest, ContractorType, ContractorStatus } from '../models/contractor.model';

@Injectable({ providedIn: 'root' })
export class ContractorService {
  private readonly contractorsUrl = `${environment.apiUrl}/contractors`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number; pageSize?: number; search?: string;
    type?: ContractorType; status?: ContractorStatus;
  }): Observable<ApiResponse<ContractorItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.type) httpParams = httpParams.set('type', params.type);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<ApiResponse<ContractorItem[]>>(this.contractorsUrl, { params: httpParams });
  }

  create(request: CreateContractorRequest): Observable<ApiResponse<ContractorItem>> {
    return this.http.post<ApiResponse<ContractorItem>>(this.contractorsUrl, request);
  }
}
