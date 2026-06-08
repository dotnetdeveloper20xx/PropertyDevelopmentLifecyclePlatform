import { createReducer, on } from '@ngrx/store';
import { initialFeasibilityState } from './feasibility.state';
import * as FeasibilityActions from './feasibility.actions';

export const feasibilityReducer = createReducer(
  initialFeasibilityState,

  // Load Feasibility
  on(FeasibilityActions.loadFeasibility, (state) => ({
    ...state, loading: true, error: null
  })),
  on(FeasibilityActions.loadFeasibilitySuccess, (state, { assessments }) => ({
    ...state, assessments, loading: false
  })),
  on(FeasibilityActions.loadFeasibilityFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Feasibility
  on(FeasibilityActions.createFeasibility, (state) => ({
    ...state, loading: true, error: null
  })),
  on(FeasibilityActions.createFeasibilitySuccess, (state, { assessment }) => ({
    ...state, assessments: [...state.assessments, assessment], loading: false
  })),
  on(FeasibilityActions.createFeasibilityFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
