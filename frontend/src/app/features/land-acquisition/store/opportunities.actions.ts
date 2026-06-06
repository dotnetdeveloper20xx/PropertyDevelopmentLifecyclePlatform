import { createAction, props } from '@ngrx/store';
import { OpportunityListItem, OpportunityStats, CreateOpportunityRequest } from '../../../core/models/opportunity.model';

// Load Opportunities
export const loadOpportunities = createAction(
  '[Opportunities] Load Opportunities',
  props<{ page?: number; pageSize?: number; search?: string }>()
);
export const loadOpportunitiesSuccess = createAction(
  '[Opportunities] Load Opportunities Success',
  props<{ opportunities: OpportunityListItem[]; totalCount: number }>()
);
export const loadOpportunitiesFailure = createAction(
  '[Opportunities] Load Opportunities Failure',
  props<{ error: string }>()
);

// Load Stats
export const loadStats = createAction('[Opportunities] Load Stats');
export const loadStatsSuccess = createAction(
  '[Opportunities] Load Stats Success',
  props<{ stats: OpportunityStats }>()
);
export const loadStatsFailure = createAction(
  '[Opportunities] Load Stats Failure',
  props<{ error: string }>()
);

// Create Opportunity
export const createOpportunity = createAction(
  '[Opportunities] Create Opportunity',
  props<{ request: CreateOpportunityRequest }>()
);
export const createOpportunitySuccess = createAction(
  '[Opportunities] Create Opportunity Success'
);
export const createOpportunityFailure = createAction(
  '[Opportunities] Create Opportunity Failure',
  props<{ error: string }>()
);
