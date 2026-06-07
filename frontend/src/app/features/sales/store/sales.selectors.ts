import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesState, salesAdapter } from './sales.state';

const selectSalesState = createFeatureSelector<SalesState>('sales');

const { selectAll } = salesAdapter.getSelectors();

export const selectAllSalesLeads = createSelector(selectSalesState, selectAll);
export const selectSalesLoading = createSelector(selectSalesState, (state) => state.loading);
export const selectSalesError = createSelector(selectSalesState, (state) => state.error);
export const selectSalesTotalCount = createSelector(selectSalesState, (state) => state.totalCount);
