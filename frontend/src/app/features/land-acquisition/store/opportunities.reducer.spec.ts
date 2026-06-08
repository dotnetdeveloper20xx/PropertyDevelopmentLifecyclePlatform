import { opportunitiesReducer } from './opportunities.reducer';
import { initialOpportunitiesState } from './opportunities.state';
import * as OpportunitiesActions from './opportunities.actions';

describe('Opportunities Reducer', () => {
  it('should return initial state', () => {
    const state = opportunitiesReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialOpportunitiesState);
  });

  it('loadOpportunities should set loading to true', () => {
    const state = opportunitiesReducer(initialOpportunitiesState, OpportunitiesActions.loadOpportunities({ page: 1, pageSize: 20 }));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loadOpportunitiesSuccess should set opportunities and totalCount', () => {
    const opportunities = [{ id: '1', name: 'Test', location: 'London', landSize: 2, landSizeUnit: 'Acres', status: 'Identified' as const, askingPrice: null, roi: null, source: null, expectedAcquisitionDate: null, createdAt: '2024-01-01' }];
    const state = opportunitiesReducer(initialOpportunitiesState, OpportunitiesActions.loadOpportunitiesSuccess({ opportunities, totalCount: 1 }));
    expect(state.loading).toBe(false);
    expect(state.totalCount).toBe(1);
  });

  it('loadOpportunitiesFailure should set error', () => {
    const state = opportunitiesReducer(initialOpportunitiesState, OpportunitiesActions.loadOpportunitiesFailure({ error: 'Failed' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed');
  });

  it('loadStatsSuccess should set stats', () => {
    const stats = { totalOpportunities: 5, identified: 2, initialReview: 1, dueDiligence: 1, offerMade: 0, underContract: 0, acquired: 1, withdrawn: 0, totalPipelineValue: 1000000, averageAskingPrice: 500000 };
    const state = opportunitiesReducer(initialOpportunitiesState, OpportunitiesActions.loadStatsSuccess({ stats }));
    expect(state.stats).toEqual(stats);
    expect(state.statsLoading).toBe(false);
  });
});
