import { createAction, props } from '@ngrx/store';
import { ReportItem, CreateReportRequest } from '../../../core/models/report.model';

// Load Reports
export const loadReports = createAction(
  '[Reports] Load Reports',
  props<{ page?: number; pageSize?: number; search?: string }>()
);
export const loadReportsSuccess = createAction(
  '[Reports] Load Reports Success',
  props<{ reports: ReportItem[]; totalCount: number }>()
);
export const loadReportsFailure = createAction(
  '[Reports] Load Reports Failure',
  props<{ error: string }>()
);

// Create Report
export const createReport = createAction(
  '[Reports] Create Report',
  props<{ request: CreateReportRequest }>()
);
export const createReportSuccess = createAction(
  '[Reports] Create Report Success',
  props<{ report: ReportItem }>()
);
export const createReportFailure = createAction(
  '[Reports] Create Report Failure',
  props<{ error: string }>()
);
