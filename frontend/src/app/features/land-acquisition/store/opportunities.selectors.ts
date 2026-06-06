import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OpportunitiesState, opportunityAdapter } from './opportunities.state';

const selectOpportunitiesState = createFeatureSelector<OpportunitiesState>('opportunities');

const { selectAll, selectTotal } = opportunityAdapter.getSelectors();

export const selectAllOpportunities = createSelector(selectOpportunitiesState, selectAll);
export const selectOpportunitiesLoading = createSelector(selectOpportunitiesState, (state) => state.loading);
export const selectOpportunitiesError = createSelector(selectOpportunitiesState, (state) => state.error);
export const selectOpportunitiesTotalCount = createSelector(selectOpportunitiesState, (state) => state.totalCount);
export const selectOpportunitiesStats = createSelector(selectOpportunitiesState, (state) => state.stats);
export const selectStatsLoading = createSelector(selectOpportunitiesState, (state) => state.statsLoading);
