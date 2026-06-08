import { createReducer, on } from '@ngrx/store';
import { initialDefectsState, defectsAdapter } from './defects.state';
import * as DefectsActions from './defects.actions';

export const defectsReducer = createReducer(
  initialDefectsState,

  // Load Defects
  on(DefectsActions.loadDefects, (state) => ({
    ...state, loading: true, error: null
  })),
  on(DefectsActions.loadDefectsSuccess, (state, { defects, totalCount }) =>
    defectsAdapter.setAll(defects, { ...state, loading: false, totalCount })
  ),
  on(DefectsActions.loadDefectsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Defect
  on(DefectsActions.createDefect, (state) => ({
    ...state, loading: true, error: null
  })),
  on(DefectsActions.createDefectSuccess, (state, { defect }) =>
    defectsAdapter.addOne(defect, { ...state, loading: false, totalCount: state.totalCount + 1 })
  ),
  on(DefectsActions.createDefectFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
