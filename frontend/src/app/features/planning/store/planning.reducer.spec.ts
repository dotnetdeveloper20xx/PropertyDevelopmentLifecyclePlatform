import { planningReducer } from './planning.reducer';
import { initialPlanningState } from './planning.state';
import * as PlanningActions from './planning.actions';

describe('Planning Reducer', () => {
  it('should return initial state', () => {
    const state = planningReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialPlanningState);
  });

  it('loadApplications should set loading to true', () => {
    const state = planningReducer(initialPlanningState, PlanningActions.loadApplications({ page: 1 }));
    expect(state.loading).toBe(true);
  });

  it('loadApplicationsFailure should set error', () => {
    const state = planningReducer(initialPlanningState, PlanningActions.loadApplicationsFailure({ error: 'Network error' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('loadConditionsSuccess should set conditions', () => {
    const conditions = [{ id: '1', planningApplicationId: 'a', conditionNumber: 1, title: 'Test', description: 'Desc', status: 'Pending' as const, dueDate: null, dischargeDate: null, dischargeReference: null, assignedTo: null, notes: null, createdAt: '2024-01-01' }];
    const state = planningReducer(initialPlanningState, PlanningActions.loadConditionsSuccess({ conditions }));
    expect(state.conditions).toEqual(conditions);
    expect(state.conditionsLoading).toBe(false);
  });
});
