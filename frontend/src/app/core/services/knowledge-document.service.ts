import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DocumentItem, CreateDocumentRequest } from '../models/document.model';

/**
 * API service for the Documents & Knowledge module (Module 13).
 * Top-level document repository independent of land acquisition documents.
 */
@Injectable({ providedIn: 'root' })
export class KnowledgeDocumentService {
  private readonly apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
  }): Observable<ApiResponse<DocumentItem[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.category) httpParams = httpParams.set('category', params.category);

    return this.http.get<ApiResponse<DocumentItem[]>>(this.apiUrl, { params: httpParams });
  }

  create(request: CreateDocumentRequest): Observable<ApiResponse<DocumentItem>> {
    return this.http.post<ApiResponse<DocumentItem>>(this.apiUrl, request);
  }
}
