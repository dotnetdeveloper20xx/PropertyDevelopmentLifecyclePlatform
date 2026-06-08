import { projectsReducer } from './projects.reducer';
import { initialProjectsState } from './projects.state';
import * as ProjectsActions from './projects.actions';

describe('Projects Reducer', () => {
  it('should return initial state', () => {
    const state = projectsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialProjectsState);
  });

  it('loadProjects should set loading to true', () => {
    const state = projectsReducer(initialProjectsState, ProjectsActions.loadProjects({ page: 1 }));
    expect(state.loading).toBe(true);
  });

  it('createMilestoneSuccess should add milestone to array', () => {
    const milestone = { id: '1', projectId: 'p1', title: 'Foundation', description: null, status: 'Upcoming' as const, targetDate: '2025-01-01', completedDate: null, sortOrder: 1, notes: null, createdAt: '2024-01-01' };
    const state = projectsReducer(initialProjectsState, ProjectsActions.createMilestoneSuccess({ milestone }));
    expect(state.milestones.length).toBe(1);
  });

  it('createRiskSuccess should add risk to array', () => {
    const risk = { id: '1', projectId: 'p1', title: 'Delay', description: null, status: 'Open' as const, impact: 'High' as const, probability: 'Medium' as const, mitigationPlan: null, owner: null, identifiedDate: null, resolvedDate: null, notes: null, createdAt: '2024-01-01' };
    const state = projectsReducer(initialProjectsState, ProjectsActions.createRiskSuccess({ risk }));
    expect(state.risks.length).toBe(1);
  });
});
