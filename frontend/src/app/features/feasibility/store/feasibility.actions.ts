import { createAction, props } from '@ngrx/store';
import { FeasibilityItem, CreateFeasibilityRequest } from '../../../core/models/feasibility.model';

// Load Feasibility Assessments
export const loadFeasibility = createAction(
  '[Feasibility] Load Feasibility',
  props<{ opportunityId: string }>()
);
export const loadFeasibilitySuccess = createAction(
  '[Feasibility] Load Feasibility Success',
  props<{ assessments: FeasibilityItem[] }>()
);
export const loadFeasibilityFailure = createAction(
  '[Feasibility] Load Feasibility Failure',
  props<{ error: string }>()
);

// Create Feasibility Assessment
export const createFeasibility = createAction(
  '[Feasibility] Create Feasibility',
  props<{ opportunityId: string; request: CreateFeasibilityRequest }>()
);
export const createFeasibilitySuccess = createAction(
  '[Feasibility] Create Feasibility Success',
  props<{ assessment: FeasibilityItem }>()
);
export const createFeasibilityFailure = createAction(
  '[Feasibility] Create Feasibility Failure',
  props<{ error: string }>()
);
