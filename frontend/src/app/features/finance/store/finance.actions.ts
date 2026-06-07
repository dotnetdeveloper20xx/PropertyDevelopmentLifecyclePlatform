import { createAction, props } from '@ngrx/store';
import {
  BudgetLineItem, CreateBudgetLineRequest,
  TransactionItem, CreateTransactionRequest
} from '../../../core/models/finance.model';

// Load Budget Lines
export const loadBudgetLines = createAction(
  '[Finance] Load Budget Lines',
  props<{ projectId: string }>()
);
export const loadBudgetLinesSuccess = createAction(
  '[Finance] Load Budget Lines Success',
  props<{ budgetLines: BudgetLineItem[] }>()
);
export const loadBudgetLinesFailure = createAction(
  '[Finance] Load Budget Lines Failure',
  props<{ error: string }>()
);

// Create Budget Line
export const createBudgetLine = createAction(
  '[Finance] Create Budget Line',
  props<{ projectId: string; request: CreateBudgetLineRequest }>()
);
export const createBudgetLineSuccess = createAction(
  '[Finance] Create Budget Line Success',
  props<{ budgetLine: BudgetLineItem }>()
);
export const createBudgetLineFailure = createAction(
  '[Finance] Create Budget Line Failure',
  props<{ error: string }>()
);

// Load Transactions
export const loadTransactions = createAction(
  '[Finance] Load Transactions',
  props<{ projectId: string }>()
);
export const loadTransactionsSuccess = createAction(
  '[Finance] Load Transactions Success',
  props<{ transactions: TransactionItem[] }>()
);
export const loadTransactionsFailure = createAction(
  '[Finance] Load Transactions Failure',
  props<{ error: string }>()
);

// Create Transaction
export const createTransaction = createAction(
  '[Finance] Create Transaction',
  props<{ projectId: string; request: CreateTransactionRequest }>()
);
export const createTransactionSuccess = createAction(
  '[Finance] Create Transaction Success',
  props<{ transaction: TransactionItem }>()
);
export const createTransactionFailure = createAction(
  '[Finance] Create Transaction Failure',
  props<{ error: string }>()
);
