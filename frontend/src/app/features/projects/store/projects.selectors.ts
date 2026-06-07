import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState, projectAdapter } from './projects.state';

const selectProjectsState = createFeatureSelector<ProjectsState>('projects');
const { selectAll } = projectAdapter.getSelectors();

export const selectAllProjects = createSelector(selectProjectsState, selectAll);
export const selectProjectsLoading = createSelector(selectProjectsState, (s) => s.loading);
export const selectProjectsError = createSelector(selectProjectsState, (s) => s.error);
export const selectProjectsTotalCount = createSelector(selectProjectsState, (s) => s.totalCount);

export const selectSelectedProject = createSelector(selectProjectsState, (s) => s.selectedProject);
export const selectSelectedLoading = createSelector(selectProjectsState, (s) => s.selectedLoading);

export const selectMilestones = createSelector(selectProjectsState, (s) => s.milestones);
export const selectMilestonesLoading = createSelector(selectProjectsState, (s) => s.milestonesLoading);

export const selectTasks = createSelector(selectProjectsState, (s) => s.tasks);
export const selectTasksLoading = createSelector(selectProjectsState, (s) => s.tasksLoading);

export const selectRisks = createSelector(selectProjectsState, (s) => s.risks);
export const selectRisksLoading = createSelector(selectProjectsState, (s) => s.risksLoading);
