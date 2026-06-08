import { createAction, props } from '@ngrx/store';
import { DefectItem, CreateDefectRequest, DefectStatus, DefectPriority } from '../../../core/models/defect.model';

// Load Defects
export const loadDefects = createAction(
  '[Defects] Load Defects',
  props<{ page?: number; pageSize?: number; search?: string; status?: DefectStatus; priority?: DefectPriority }>()
);
export const loadDefectsSuccess = createAction(
  '[Defects] Load Defects Success',
  props<{ defects: DefectItem[]; totalCount: number }>()
);
export const loadDefectsFailure = createAction(
  '[Defects] Load Defects Failure',
  props<{ error: string }>()
);

// Create Defect
export const createDefect = createAction(
  '[Defects] Create Defect',
  props<{ request: CreateDefectRequest }>()
);
export const createDefectSuccess = createAction(
  '[Defects] Create Defect Success',
  props<{ defect: DefectItem }>()
);
export const createDefectFailure = createAction(
  '[Defects] Create Defect Failure',
  props<{ error: string }>()
);
