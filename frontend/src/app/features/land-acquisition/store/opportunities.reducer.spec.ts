import { describe, it, expect } from 'vitest';
import { opportunitiesReducer } from './opportunities.reducer';
import { initialOpportunitiesState } from './opportunities.state';
import * as OpportunitiesActions from './opportunities.actions';

describe('opportunitiesReducer', () => {
  describe('initial state', () => {
    it('should return initial state when action is unknown', () => {
      const action = { type: 'UNKNOWN' } as any;
      const state = opportunitiesReducer(undefined, action);
      expect(state).toEqual(initialOpportunitiesState);
    });

    it('should have loading=false and no error initially', () => {
      expect(initialOpportunitiesState.loading).toBe(false);
      expect(initialOpportunitiesState.error).toBeNull();
      expect(initialOpportunitiesState.totalCount).toBe(0);
    });
  });

  describe('loadOpportunities', () => {
    it('should set loading to true and clear error', () => {
      const state = opportunitiesReducer(
        { ...initialOpportunitiesState, error: 'previous error' },
        OpportunitiesActions.loadOpportunities()
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loadOpportunitiesSuccess', () => {
    it('should set opportunities and totalCount, and clear loading', () => {
      const opportunities = [
        { id: '1', name: 'Site A', location: 'London', landSize: 2.5, status: 'Identified' as any, source: 'Agent', createdAt: '2025-01-01' },
        { id: '2', name: 'Site B', location: 'Manchester', landSize: 5.0, status: 'DueDiligence' as any, source: 'Direct', createdAt: '2025-02-01' }
      ];
      const state = opportunitiesReducer(
        { ...initialOpportunitiesState, loading: true },
        OpportunitiesActions.loadOpportunitiesSuccess({ opportunities, totalCount: 2 })
      );
      expect(state.loading).toBe(false);
      expect(state.totalCount).toBe(2);
      expect(state.ids.length).toBe(2);
      expect(state.entities['1']?.name).toBe('Site A');
      expect(state.entities['2']?.name).toBe('Site B');
    });
  });

  describe('loadOpportunitiesFailure', () => {
    it('should set error and clear loading', () => {
      const state = opportunitiesReducer(
        { ...initialOpportunitiesState, loading: true },
        OpportunitiesActions.loadOpportunitiesFailure({ error: 'Network error' })
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('createOpportunity', () => {
    it('should set loading to true', () => {
      const state = opportunitiesReducer(
        initialOpportunitiesState,
        OpportunitiesActions.createOpportunity({ request: { name: 'New', location: 'Test', landSize: 1 } })
      );
      expect(state.loading).toBe(true);
    });
  });

  describe('createOpportunitySuccess', () => {
    it('should set loading to false', () => {
      const state = opportunitiesReducer(
        { ...initialOpportunitiesState, loading: true },
        OpportunitiesActions.createOpportunitySuccess()
      );
      expect(state.loading).toBe(false);
    });
  });

  describe('createOpportunityFailure', () => {
    it('should set error and clear loading', () => {
      const state = opportunitiesReducer(
        { ...initialOpportunitiesState, loading: true },
        OpportunitiesActions.createOpportunityFailure({ error: 'Validation failed' })
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Validation failed');
    });
  });

  describe('loadStats', () => {
    it('should set statsLoading to true', () => {
      const state = opportunitiesReducer(
        initialOpportunitiesState,
        OpportunitiesActions.loadStats()
      );
      expect(state.statsLoading).toBe(true);
    });
  });

  describe('loadStatsSuccess', () => {
    it('should set stats and clear statsLoading', () => {
      const stats = { total: 10, identified: 3, dueDiligence: 2, offerMade: 1, underContract: 1, acquired: 3 };
      const state = opportunitiesReducer(
        { ...initialOpportunitiesState, statsLoading: true },
        OpportunitiesActions.loadStatsSuccess({ stats })
      );
      expect(state.statsLoading).toBe(false);
      expect(state.stats).toEqual(stats);
    });
  });
});
