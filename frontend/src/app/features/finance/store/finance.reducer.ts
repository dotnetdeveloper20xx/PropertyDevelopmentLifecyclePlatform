import { createReducer, on } from '@ngrx/store';
import { initialFinanceState } from './finance.state';
import * as FinanceActions from './finance.actions';

export const financeReducer = createReducer(
  initialFinanceState,

  // Load Budget Lines
  on(FinanceActions.loadBudgetLines, (state) => ({
    ...state, budgetLinesLoading: true, error: null
  })),
  on(FinanceActions.loadBudgetLinesSuccess, (state, { budgetLines }) => ({
    ...state, budgetLines, budgetLinesLoading: false
  })),
  on(FinanceActions.loadBudgetLinesFailure, (state, { error }) => ({
    ...state, budgetLinesLoading: false, error
  })),

  // Create Budget Line
  on(FinanceActions.createBudgetLine, (state) => ({
    ...state, budgetLinesLoading: true, error: null
  })),
  on(FinanceActions.createBudgetLineSuccess, (state, { budgetLine }) => ({
    ...state, budgetLines: [budgetLine, ...state.budgetLines], budgetLinesLoading: false
  })),
  on(FinanceActions.createBudgetLineFailure, (state, { error }) => ({
    ...state, budgetLinesLoading: false, error
  })),

  // Load Transactions
  on(FinanceActions.loadTransactions, (state) => ({
    ...state, transactionsLoading: true, error: null
  })),
  on(FinanceActions.loadTransactionsSuccess, (state, { transactions }) => ({
    ...state, transactions, transactionsLoading: false
  })),
  on(FinanceActions.loadTransactionsFailure, (state, { error }) => ({
    ...state, transactionsLoading: false, error
  })),

  // Create Transaction
  on(FinanceActions.createTransaction, (state) => ({
    ...state, transactionsLoading: true, error: null
  })),
  on(FinanceActions.createTransactionSuccess, (state, { transaction }) => ({
    ...state, transactions: [transaction, ...state.transactions], transactionsLoading: false
  })),
  on(FinanceActions.createTransactionFailure, (state, { error }) => ({
    ...state, transactionsLoading: false, error
  }))
);
