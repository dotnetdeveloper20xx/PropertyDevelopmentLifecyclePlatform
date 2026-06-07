import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlanningState, planningAdapter } from './planning.state';

const selectPlanningState = createFeatureSelector<PlanningState>('planning');

const { selectAll } = planningAdapter.getSelectors();

export const selectAllApplications = createSelector(selectPlanningState, selectAll);
export const selectPlanningLoading = createSelector(selectPlanningState, (state) => state.loading);
export const selectPlanningError = createSelector(selectPlanningState, (state) => state.error);
export const selectPlanningTotalCount = createSelector(selectPlanningState, (state) => state.totalCount);

export const selectSelectedApplication = createSelector(selectPlanningState, (state) => state.selectedApplication);
export const selectSelectedLoading = createSelector(selectPlanningState, (state) => state.selectedLoading);

export const selectConditions = createSelector(selectPlanningState, (state) => state.conditions);
export const selectConditionsLoading = createSelector(selectPlanningState, (state) => state.conditionsLoading);

export const selectAppeals = createSelector(selectPlanningState, (state) => state.appeals);
export const selectAppealsLoading = createSelector(selectPlanningState, (state) => state.appealsLoading);
