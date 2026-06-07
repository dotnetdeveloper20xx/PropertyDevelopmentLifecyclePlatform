import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConstructionState } from './construction.state';

const selectState = createFeatureSelector<ConstructionState>('construction');

export const selectStages = createSelector(selectState, (s) => s.stages);
export const selectStagesLoading = createSelector(selectState, (s) => s.stagesLoading);
export const selectInspections = createSelector(selectState, (s) => s.inspections);
export const selectInspectionsLoading = createSelector(selectState, (s) => s.inspectionsLoading);
export const selectSnags = createSelector(selectState, (s) => s.snags);
export const selectSnagsLoading = createSelector(selectState, (s) => s.snagsLoading);
export const selectError = createSelector(selectState, (s) => s.error);
