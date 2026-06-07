import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface DocumentListItem {
  id: string;
  opportunityId: string;
  fileName: string;
  docType: DocumentType;
  contentType: string | null;
  fileSizeBytes: number;
  description: string | null;
  createdAt: string;
  createdBy: string;
}

export interface CreateDocumentRequest {
  fileName: string;
  docType: DocumentType;
  contentType?: string;
  fileSizeBytes: number;
  description?: string;
  filePath: string;
}

export type DocumentType = 'TitleDeed' | 'SearchReport' | 'LegalDocument' | 'EnvironmentalReport' | 'PlanningDocument' | 'ValuationReport' | 'Contract' | 'Other';

/**
 * API service for document operations (sub-resource of opportunities).
 */
@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly baseUrl = `${environment.apiUrl}/opportunities`;

  constructor(private http: HttpClient) {}

  getByOpportunity(opportunityId: string): Observable<ApiResponse<DocumentListItem[]>> {
    return this.http.get<ApiResponse<DocumentListItem[]>>(
      `${this.baseUrl}/${opportunityId}/documents`
    );
  }

  create(opportunityId: string, request: CreateDocumentRequest): Observable<ApiResponse<DocumentListItem>> {
    return this.http.post<ApiResponse<DocumentListItem>>(
      `${this.baseUrl}/${opportunityId}/documents`, request
    );
  }

  delete(opportunityId: string, documentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${opportunityId}/documents/${documentId}`
    );
  }
}
