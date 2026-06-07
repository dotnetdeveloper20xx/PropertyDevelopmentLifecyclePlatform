import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface ActivityItem {
  id: string;
  action: string;
  entityName: string;
  entityId: string;
  userName: string;
  timestamp: string;
  affectedColumns: string | null;
  oldValues: string | null;
  newValues: string | null;
}

/**
 * API service for activity/audit trail per opportunity.
 */
@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly baseUrl = `${environment.apiUrl}/opportunities`;

  constructor(private http: HttpClient) {}

  getByOpportunity(opportunityId: string): Observable<ApiResponse<ActivityItem[]>> {
    return this.http.get<ApiResponse<ActivityItem[]>>(
      `${this.baseUrl}/${opportunityId}/activity`
    );
  }
}
