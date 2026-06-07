/**
 * Finance & Budget Control models matching backend DTOs.
 */

export type BudgetLineCategory = 'Construction' | 'Materials' | 'Labour' | 'Professional' | 'Land' | 'Marketing' | 'Contingency' | 'Other';
export type BudgetLineStatus = 'Draft' | 'Approved' | 'Overspent' | 'Closed';
export type TransactionType = 'Income' | 'Expense' | 'Transfer' | 'Adjustment';
export type TransactionStatus = 'Pending' | 'Approved' | 'Processed' | 'Rejected' | 'Void';

export interface BudgetLineItem {
  id: string;
  projectId: string;
  category: BudgetLineCategory;
  description: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  currency: string;
  status: BudgetLineStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateBudgetLineRequest {
  category: BudgetLineCategory;
  description: string;
  allocatedAmount: number;
  currency?: string;
  notes?: string;
}

export interface TransactionItem {
  id: string;
  projectId: string;
  budgetLineId: string | null;
  type: TransactionType;
  description: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  reference: string | null;
  transactionDate: string;
  approvedBy: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateTransactionRequest {
  budgetLineId?: string;
  type: TransactionType;
  description: string;
  amount: number;
  currency?: string;
  reference?: string;
  transactionDate?: string;
  notes?: string;
}
