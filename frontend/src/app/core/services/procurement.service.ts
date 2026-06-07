import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  PurchaseOrderItem, CreatePurchaseOrderRequest,
  DeliveryItem, CreateDeliveryRequest
} from '../models/procurement.model';

@Injectable({ providedIn: 'root' })
export class ProcurementService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPurchaseOrders(projectId: string): Observable<ApiResponse<PurchaseOrderItem[]>> {
    return this.http.get<ApiResponse<PurchaseOrderItem[]>>(
      `${this.apiUrl}/projects/${projectId}/purchase-orders`);
  }

  createPurchaseOrder(projectId: string, request: CreatePurchaseOrderRequest): Observable<ApiResponse<PurchaseOrderItem>> {
    return this.http.post<ApiResponse<PurchaseOrderItem>>(
      `${this.apiUrl}/projects/${projectId}/purchase-orders`, request);
  }

  getDeliveries(orderId: string): Observable<ApiResponse<DeliveryItem[]>> {
    return this.http.get<ApiResponse<DeliveryItem[]>>(
      `${this.apiUrl}/purchase-orders/${orderId}/deliveries`);
  }

  createDelivery(orderId: string, request: CreateDeliveryRequest): Observable<ApiResponse<DeliveryItem>> {
    return this.http.post<ApiResponse<DeliveryItem>>(
      `${this.apiUrl}/purchase-orders/${orderId}/deliveries`, request);
  }
}
