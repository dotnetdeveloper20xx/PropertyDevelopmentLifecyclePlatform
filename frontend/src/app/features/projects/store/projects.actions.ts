import { createAction, props } from '@ngrx/store';
import {
  ProjectListItem, ProjectDetail, CreateProjectRequest, ProjectStatus,
  MilestoneItem, CreateMilestoneRequest,
  ProjectTaskItem, CreateProjectTaskRequest,
  ProjectRiskItem, CreateProjectRiskRequest
} from '../../../core/models/project.model';

// Projects List
export const loadProjects = createAction('[Projects] Load Projects', props<{ page?: number; pageSize?: number; search?: string; status?: ProjectStatus }>());
export const loadProjectsSuccess = createAction('[Projects] Load Projects Success', props<{ projects: ProjectListItem[]; totalCount: number }>());
export const loadProjectsFailure = createAction('[Projects] Load Projects Failure', props<{ error: string }>());

// Single Project
export const loadProject = createAction('[Projects] Load Project', props<{ id: string }>());
export const loadProjectSuccess = createAction('[Projects] Load Project Success', props<{ project: ProjectDetail }>());
export const loadProjectFailure = createAction('[Projects] Load Project Failure', props<{ error: string }>());

// Create Project
export const createProject = createAction('[Projects] Create Project', props<{ request: CreateProjectRequest }>());
export const createProjectSuccess = createAction('[Projects] Create Project Success');
export const createProjectFailure = createAction('[Projects] Create Project Failure', props<{ error: string }>());

// Change Project Status
export const changeStatus = createAction('[Projects] Change Status', props<{ id: string; newStatus: ProjectStatus }>());
export const changeStatusSuccess = createAction('[Projects] Change Status Success');
export const changeStatusFailure = createAction('[Projects] Change Status Failure', props<{ error: string }>());

// Milestones
export const loadMilestones = createAction('[Projects] Load Milestones', props<{ projectId: string }>());
export const loadMilestonesSuccess = createAction('[Projects] Load Milestones Success', props<{ milestones: MilestoneItem[] }>());
export const loadMilestonesFailure = createAction('[Projects] Load Milestones Failure', props<{ error: string }>());

export const createMilestone = createAction('[Projects] Create Milestone', props<{ projectId: string; request: CreateMilestoneRequest }>());
export const createMilestoneSuccess = createAction('[Projects] Create Milestone Success', props<{ milestone: MilestoneItem }>());
export const createMilestoneFailure = createAction('[Projects] Create Milestone Failure', props<{ error: string }>());

// Tasks
export const loadTasks = createAction('[Projects] Load Tasks', props<{ projectId: string }>());
export const loadTasksSuccess = createAction('[Projects] Load Tasks Success', props<{ tasks: ProjectTaskItem[] }>());
export const loadTasksFailure = createAction('[Projects] Load Tasks Failure', props<{ error: string }>());

export const createTask = createAction('[Projects] Create Task', props<{ projectId: string; request: CreateProjectTaskRequest }>());
export const createTaskSuccess = createAction('[Projects] Create Task Success', props<{ task: ProjectTaskItem }>());
export const createTaskFailure = createAction('[Projects] Create Task Failure', props<{ error: string }>());

// Risks
export const loadRisks = createAction('[Projects] Load Risks', props<{ projectId: string }>());
export const loadRisksSuccess = createAction('[Projects] Load Risks Success', props<{ risks: ProjectRiskItem[] }>());
export const loadRisksFailure = createAction('[Projects] Load Risks Failure', props<{ error: string }>());

export const createRisk = createAction('[Projects] Create Risk', props<{ projectId: string; request: CreateProjectRiskRequest }>());
export const createRiskSuccess = createAction('[Projects] Create Risk Success', props<{ risk: ProjectRiskItem }>());
export const createRiskFailure = createAction('[Projects] Create Risk Failure', props<{ error: string }>());
