import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InvestorsState, investorsAdapter } from './investors.state';

const selectInvestorsState = createFeatureSelector<InvestorsState>('investors');

const { selectAll } = investorsAdapter.getSelectors();

export const selectAllInvestors = createSelector(selectInvestorsState, selectAll);
export const selectInvestorsLoading = createSelector(selectInvestorsState, (state) => state.loading);
export const selectInvestorsError = createSelector(selectInvestorsState, (state) => state.error);
export const selectInvestorsTotalCount = createSelector(selectInvestorsState, (state) => state.totalCount);
