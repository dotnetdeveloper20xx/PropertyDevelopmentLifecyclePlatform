import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface OfferListItem {
  id: string;
  opportunityId: string;
  amount: number;
  currency: string;
  offerDate: string;
  validUntil: string | null;
  status: OfferStatus;
  counterOfferAmount: number | null;
  createdAt: string;
}

export interface CreateOfferRequest {
  amount: number;
  currency?: string;
  validUntil?: string;
  conditions?: string;
  notes?: string;
}

export interface ChangeOfferStatusRequest {
  newStatus: OfferStatus;
  counterOfferAmount?: number;
  notes?: string;
}

export type OfferStatus = 'UnderReview' | 'Accepted' | 'Rejected' | 'CounterOffered' | 'Withdrawn';

/**
 * API service for offer operations (sub-resource of opportunities).
 */
@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly baseUrl = `${environment.apiUrl}/opportunities`;

  constructor(private http: HttpClient) {}

  getByOpportunity(opportunityId: string): Observable<ApiResponse<OfferListItem[]>> {
    return this.http.get<ApiResponse<OfferListItem[]>>(
      `${this.baseUrl}/${opportunityId}/offers`
    );
  }

  create(opportunityId: string, request: CreateOfferRequest): Observable<ApiResponse<OfferListItem>> {
    return this.http.post<ApiResponse<OfferListItem>>(
      `${this.baseUrl}/${opportunityId}/offers`, request
    );
  }

  changeStatus(opportunityId: string, offerId: string, request: ChangeOfferStatusRequest): Observable<ApiResponse<OfferListItem>> {
    return this.http.patch<ApiResponse<OfferListItem>>(
      `${this.baseUrl}/${opportunityId}/offers/${offerId}/status`, request
    );
  }
}
