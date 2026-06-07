import { BudgetLineItem, TransactionItem } from '../../../core/models/finance.model';

export interface FinanceState {
  budgetLines: BudgetLineItem[];
  budgetLinesLoading: boolean;
  transactions: TransactionItem[];
  transactionsLoading: boolean;
  error: string | null;
}

export const initialFinanceState: FinanceState = {
  budgetLines: [],
  budgetLinesLoading: false,
  transactions: [],
  transactionsLoading: false,
  error: null
};
