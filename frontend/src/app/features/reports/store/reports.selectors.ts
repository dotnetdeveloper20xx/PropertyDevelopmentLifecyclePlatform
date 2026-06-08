import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReportsState } from './reports.state';

const selectReportsState = createFeatureSelector<ReportsState>('reports');

export const selectReports = createSelector(selectReportsState, (state) => state.reports);
export const selectReportsLoading = createSelector(selectReportsState, (state) => state.loading);
export const selectReportsTotalCount = createSelector(selectReportsState, (state) => state.totalCount);
export const selectReportsError = createSelector(selectReportsState, (state) => state.error);
