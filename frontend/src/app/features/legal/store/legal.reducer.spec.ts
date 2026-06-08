import { legalReducer } from './legal.reducer';
import { initialLegalState } from './legal.state';
import * as LegalActions from './legal.actions';

describe('Legal Reducer', () => {
  it('should return initial state', () => {
    const state = legalReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialLegalState);
  });

  it('loadContracts should set loading to true', () => {
    const state = legalReducer(initialLegalState, LegalActions.loadContracts({ page: 1 }));
    expect(state.loading).toBe(true);
  });

  it('loadContractsFailure should set error', () => {
    const state = legalReducer(initialLegalState, LegalActions.loadContractsFailure({ error: 'Failed' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed');
  });

  it('createTaskSuccess should add task to array', () => {
    const task = { id: '1', contractId: null, opportunityId: null, title: 'Review', description: null, priority: 'High' as const, status: 'Open' as const, assignedTo: null, dueDate: null, completedDate: null, notes: null, createdAt: '2024-01-01' };
    const state = legalReducer(initialLegalState, LegalActions.createTaskSuccess({ task }));
    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0].title).toBe('Review');
  });
});
