import { describe, it, expect } from 'vitest';
import * as Selectors from './opportunities.selectors';
import { initialOpportunitiesState, opportunityAdapter } from './opportunities.state';

describe('Opportunities Selectors', () => {
  const mockOpportunities = [
    { id: '1', name: 'Site A', location: 'London', landSize: 2.5, status: 'Identified' as any, source: 'Agent', createdAt: '2025-01-01' },
    { id: '2', name: 'Site B', location: 'Manchester', landSize: 5.0, status: 'DueDiligence' as any, source: 'Direct', createdAt: '2025-02-01' }
  ];

  const populatedState = opportunityAdapter.setAll(mockOpportunities, {
    ...initialOpportunitiesState,
    loading: false,
    totalCount: 2,
    stats: { total: 10, identified: 3, dueDiligence: 2, offerMade: 1, underContract: 1, acquired: 3 },
    statsLoading: false
  });

  const rootState = { opportunities: populatedState } as any;

  it('selectAllOpportunities should return all entities', () => {
    const result = Selectors.selectAllOpportunities(rootState);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Site A');
  });

  it('selectOpportunitiesLoading should return loading state', () => {
    expect(Selectors.selectOpportunitiesLoading(rootState)).toBe(false);
    const loadingState = { opportunities: { ...populatedState, loading: true } } as any;
    expect(Selectors.selectOpportunitiesLoading(loadingState)).toBe(true);
  });

  it('selectOpportunitiesError should return error', () => {
    expect(Selectors.selectOpportunitiesError(rootState)).toBeNull();
    const errorState = { opportunities: { ...populatedState, error: 'Network failure' } } as any;
    expect(Selectors.selectOpportunitiesError(errorState)).toBe('Network failure');
  });

  it('selectOpportunitiesTotalCount should return total count', () => {
    expect(Selectors.selectOpportunitiesTotalCount(rootState)).toBe(2);
  });

  it('selectOpportunitiesStats should return stats object', () => {
    expect(Selectors.selectOpportunitiesStats(rootState)).toEqual({
      total: 10, identified: 3, dueDiligence: 2, offerMade: 1, underContract: 1, acquired: 3
    });
  });

  it('selectStatsLoading should return stats loading state', () => {
    expect(Selectors.selectStatsLoading(rootState)).toBe(false);
  });
});
