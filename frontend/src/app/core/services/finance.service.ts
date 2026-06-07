import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  BudgetLineItem, CreateBudgetLineRequest,
  TransactionItem, CreateTransactionRequest
} from '../models/finance.model';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBudgetLines(projectId: string): Observable<ApiResponse<BudgetLineItem[]>> {
    return this.http.get<ApiResponse<BudgetLineItem[]>>(
      `${this.apiUrl}/projects/${projectId}/budget-lines`);
  }

  createBudgetLine(projectId: string, request: CreateBudgetLineRequest): Observable<ApiResponse<BudgetLineItem>> {
    return this.http.post<ApiResponse<BudgetLineItem>>(
      `${this.apiUrl}/projects/${projectId}/budget-lines`, request);
  }

  getTransactions(projectId: string): Observable<ApiResponse<TransactionItem[]>> {
    return this.http.get<ApiResponse<TransactionItem[]>>(
      `${this.apiUrl}/projects/${projectId}/transactions`);
  }

  createTransaction(projectId: string, request: CreateTransactionRequest): Observable<ApiResponse<TransactionItem>> {
    return this.http.post<ApiResponse<TransactionItem>>(
      `${this.apiUrl}/projects/${projectId}/transactions`, request);
  }
}
