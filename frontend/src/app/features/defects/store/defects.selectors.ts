import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DefectsState, defectsAdapter } from './defects.state';

const selectDefectsState = createFeatureSelector<DefectsState>('defects');

const { selectAll } = defectsAdapter.getSelectors();

export const selectAllDefects = createSelector(selectDefectsState, selectAll);
export const selectDefectsLoading = createSelector(selectDefectsState, (state) => state.loading);
export const selectDefectsError = createSelector(selectDefectsState, (state) => state.error);
export const selectDefectsTotalCount = createSelector(selectDefectsState, (state) => state.totalCount);
