import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FinanceState } from './finance.state';

const selectFinanceState = createFeatureSelector<FinanceState>('finance');

export const selectBudgetLines = createSelector(selectFinanceState, (state) => state.budgetLines);
export const selectBudgetLinesLoading = createSelector(selectFinanceState, (state) => state.budgetLinesLoading);
export const selectTransactions = createSelector(selectFinanceState, (state) => state.transactions);
export const selectTransactionsLoading = createSelector(selectFinanceState, (state) => state.transactionsLoading);
export const selectFinanceError = createSelector(selectFinanceState, (state) => state.error);
