import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContractorsState, contractorsAdapter } from './contractors.state';

const selectContractorsState = createFeatureSelector<ContractorsState>('contractors');

const { selectAll } = contractorsAdapter.getSelectors();

export const selectAllContractors = createSelector(selectContractorsState, selectAll);
export const selectContractorsLoading = createSelector(selectContractorsState, (state) => state.loading);
export const selectContractorsError = createSelector(selectContractorsState, (state) => state.error);
export const selectContractorsTotalCount = createSelector(selectContractorsState, (state) => state.totalCount);
