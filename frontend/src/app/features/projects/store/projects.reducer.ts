import { createReducer, on } from '@ngrx/store';
import { initialProjectsState, projectAdapter } from './projects.state';
import * as ProjectsActions from './projects.actions';

export const projectsReducer = createReducer(
  initialProjectsState,

  // Projects List
  on(ProjectsActions.loadProjects, (state) => ({ ...state, loading: true, error: null })),
  on(ProjectsActions.loadProjectsSuccess, (state, { projects, totalCount }) =>
    projectAdapter.setAll(projects, { ...state, loading: false, totalCount })),
  on(ProjectsActions.loadProjectsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Single Project
  on(ProjectsActions.loadProject, (state) => ({ ...state, selectedLoading: true, error: null })),
  on(ProjectsActions.loadProjectSuccess, (state, { project }) => ({ ...state, selectedProject: project, selectedLoading: false })),
  on(ProjectsActions.loadProjectFailure, (state, { error }) => ({ ...state, selectedLoading: false, error })),

  // Create Project
  on(ProjectsActions.createProject, (state) => ({ ...state, loading: true })),
  on(ProjectsActions.createProjectSuccess, (state) => ({ ...state, loading: false })),
  on(ProjectsActions.createProjectFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Change Status
  on(ProjectsActions.changeStatus, (state) => ({ ...state, loading: true })),
  on(ProjectsActions.changeStatusSuccess, (state) => ({ ...state, loading: false })),
  on(ProjectsActions.changeStatusFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Milestones
  on(ProjectsActions.loadMilestones, (state) => ({ ...state, milestonesLoading: true })),
  on(ProjectsActions.loadMilestonesSuccess, (state, { milestones }) => ({ ...state, milestones, milestonesLoading: false })),
  on(ProjectsActions.loadMilestonesFailure, (state) => ({ ...state, milestonesLoading: false })),
  on(ProjectsActions.createMilestoneSuccess, (state, { milestone }) => ({ ...state, milestones: [...state.milestones, milestone] })),

  // Tasks
  on(ProjectsActions.loadTasks, (state) => ({ ...state, tasksLoading: true })),
  on(ProjectsActions.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, tasksLoading: false })),
  on(ProjectsActions.loadTasksFailure, (state) => ({ ...state, tasksLoading: false })),
  on(ProjectsActions.createTaskSuccess, (state, { task }) => ({ ...state, tasks: [task, ...state.tasks] })),

  // Risks
  on(ProjectsActions.loadRisks, (state) => ({ ...state, risksLoading: true })),
  on(ProjectsActions.loadRisksSuccess, (state, { risks }) => ({ ...state, risks, risksLoading: false })),
  on(ProjectsActions.loadRisksFailure, (state) => ({ ...state, risksLoading: false })),
  on(ProjectsActions.createRiskSuccess, (state, { risk }) => ({ ...state, risks: [risk, ...state.risks] }))
);
