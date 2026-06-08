import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeasibilityState } from './feasibility.state';

const selectFeasibilityState = createFeatureSelector<FeasibilityState>('feasibility');

export const selectAssessments = createSelector(selectFeasibilityState, (s) => s.assessments);
export const selectFeasibilityLoading = createSelector(selectFeasibilityState, (s) => s.loading);
export const selectFeasibilityError = createSelector(selectFeasibilityState, (s) => s.error);
