import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LegalState, contractAdapter } from './legal.state';

const selectLegalState = createFeatureSelector<LegalState>('legal');
const { selectAll } = contractAdapter.getSelectors();

export const selectAllContracts = createSelector(selectLegalState, selectAll);
export const selectLegalLoading = createSelector(selectLegalState, (s) => s.loading);
export const selectLegalError = createSelector(selectLegalState, (s) => s.error);
export const selectContractsTotalCount = createSelector(selectLegalState, (s) => s.totalCount);

export const selectSelectedContract = createSelector(selectLegalState, (s) => s.selectedContract);
export const selectSelectedLoading = createSelector(selectLegalState, (s) => s.selectedLoading);

export const selectTasks = createSelector(selectLegalState, (s) => s.tasks);
export const selectTasksLoading = createSelector(selectLegalState, (s) => s.tasksLoading);
export const selectTasksTotalCount = createSelector(selectLegalState, (s) => s.tasksTotalCount);

export const selectComplianceChecks = createSelector(selectLegalState, (s) => s.complianceChecks);
export const selectComplianceLoading = createSelector(selectLegalState, (s) => s.complianceLoading);
