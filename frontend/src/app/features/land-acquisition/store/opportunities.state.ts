import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OpportunityListItem, OpportunityStats } from '../../../core/models/opportunity.model';

/**
 * NgRx Entity adapter for normalized opportunity storage.
 */
export const opportunityAdapter: EntityAdapter<OpportunityListItem> =
  createEntityAdapter<OpportunityListItem>({ selectId: (opp) => opp.id });

export interface OpportunitiesState extends EntityState<OpportunityListItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  stats: OpportunityStats | null;
  statsLoading: boolean;
}

export const initialOpportunitiesState: OpportunitiesState = opportunityAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
  stats: null,
  statsLoading: false
});
