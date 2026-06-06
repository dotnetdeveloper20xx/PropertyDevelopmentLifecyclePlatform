import { createReducer, on } from '@ngrx/store';
import { initialOpportunitiesState, opportunityAdapter } from './opportunities.state';
import * as OpportunitiesActions from './opportunities.actions';

export const opportunitiesReducer = createReducer(
  initialOpportunitiesState,

  // Load Opportunities
  on(OpportunitiesActions.loadOpportunities, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OpportunitiesActions.loadOpportunitiesSuccess, (state, { opportunities, totalCount }) =>
    opportunityAdapter.setAll(opportunities, { ...state, loading: false, totalCount })
  ),
  on(OpportunitiesActions.loadOpportunitiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Stats
  on(OpportunitiesActions.loadStats, (state) => ({ ...state, statsLoading: true })),
  on(OpportunitiesActions.loadStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    statsLoading: false
  })),
  on(OpportunitiesActions.loadStatsFailure, (state) => ({
    ...state,
    statsLoading: false
  })),

  // Create
  on(OpportunitiesActions.createOpportunity, (state) => ({ ...state, loading: true })),
  on(OpportunitiesActions.createOpportunitySuccess, (state) => ({ ...state, loading: false })),
  on(OpportunitiesActions.createOpportunityFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
