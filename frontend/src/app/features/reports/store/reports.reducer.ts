import { createReducer, on } from '@ngrx/store';
import { initialReportsState } from './reports.state';
import * as ReportsActions from './reports.actions';

export const reportsReducer = createReducer(
  initialReportsState,

  // Load Reports
  on(ReportsActions.loadReports, (state) => ({
    ...state, loading: true, error: null
  })),
  on(ReportsActions.loadReportsSuccess, (state, { reports, totalCount }) => ({
    ...state, reports, totalCount, loading: false
  })),
  on(ReportsActions.loadReportsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Report
  on(ReportsActions.createReport, (state) => ({
    ...state, loading: true, error: null
  })),
  on(ReportsActions.createReportSuccess, (state, { report }) => ({
    ...state, reports: [report, ...state.reports], totalCount: state.totalCount + 1, loading: false
  })),
  on(ReportsActions.createReportFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
