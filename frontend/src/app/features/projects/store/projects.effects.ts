import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { ProjectService } from '../../../core/services/project.service';
import { ToastService } from '../../../core/services/toast.service';
import * as ProjectsActions from './projects.actions';

@Injectable()
export class ProjectsEffects {
  private actions$ = inject(Actions);
  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadProjects),
    exhaustMap(({ page, pageSize, search, status }) =>
      this.projectService.getAll({ page, pageSize, search, status }).pipe(
        map((r) => ProjectsActions.loadProjectsSuccess({ projects: r.data, totalCount: r.pagination?.totalCount ?? r.data?.length ?? 0 })),
        catchError((e) => of(ProjectsActions.loadProjectsFailure({ error: e.error?.errors?.[0] ?? 'Failed to load projects' })))
      ))
  ));

  loadProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadProject),
    exhaustMap(({ id }) =>
      this.projectService.getById(id).pipe(
        map((r) => ProjectsActions.loadProjectSuccess({ project: r.data })),
        catchError((e) => of(ProjectsActions.loadProjectFailure({ error: e.error?.errors?.[0] ?? 'Failed to load project' })))
      ))
  ));

  createProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createProject),
    exhaustMap(({ request }) =>
      this.projectService.create(request).pipe(
        map(() => ProjectsActions.createProjectSuccess()),
        catchError((e) => of(ProjectsActions.createProjectFailure({ error: e.error?.errors?.[0] ?? 'Failed to create project' })))
      ))
  ));

  createProjectSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createProjectSuccess),
    tap(() => { this.toastService.success('Project created successfully'); this.router.navigate(['/projects']); })
  ), { dispatch: false });

  changeStatus$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.changeStatus),
    exhaustMap(({ id, newStatus }) =>
      this.projectService.changeStatus(id, newStatus).pipe(
        map(() => ProjectsActions.changeStatusSuccess()),
        catchError((e) => of(ProjectsActions.changeStatusFailure({ error: e.error?.errors?.[0] ?? 'Failed to change project status' })))
      ))
  ));

  changeStatusSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.changeStatusSuccess),
    tap(() => this.toastService.success('Project status updated'))
  ), { dispatch: false });

  // Milestones
  loadMilestones$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadMilestones),
    exhaustMap(({ projectId }) =>
      this.projectService.getMilestones(projectId).pipe(
        map((r) => ProjectsActions.loadMilestonesSuccess({ milestones: r.data })),
        catchError((e) => of(ProjectsActions.loadMilestonesFailure({ error: e.error?.errors?.[0] ?? 'Failed to load milestones' })))
      ))
  ));

  createMilestone$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createMilestone),
    exhaustMap(({ projectId, request }) =>
      this.projectService.createMilestone(projectId, request).pipe(
        map((r) => ProjectsActions.createMilestoneSuccess({ milestone: r.data })),
        catchError((e) => of(ProjectsActions.createMilestoneFailure({ error: e.error?.errors?.[0] ?? 'Failed to create milestone' })))
      ))
  ));

  createMilestoneSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createMilestoneSuccess),
    tap(() => this.toastService.success('Milestone created'))
  ), { dispatch: false });

  // Tasks
  loadTasks$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadTasks),
    exhaustMap(({ projectId }) =>
      this.projectService.getTasks(projectId).pipe(
        map((r) => ProjectsActions.loadTasksSuccess({ tasks: r.data })),
        catchError((e) => of(ProjectsActions.loadTasksFailure({ error: e.error?.errors?.[0] ?? 'Failed to load tasks' })))
      ))
  ));

  createTask$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createTask),
    exhaustMap(({ projectId, request }) =>
      this.projectService.createTask(projectId, request).pipe(
        map((r) => ProjectsActions.createTaskSuccess({ task: r.data })),
        catchError((e) => of(ProjectsActions.createTaskFailure({ error: e.error?.errors?.[0] ?? 'Failed to create task' })))
      ))
  ));

  createTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createTaskSuccess),
    tap(() => this.toastService.success('Task created'))
  ), { dispatch: false });

  // Risks
  loadRisks$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadRisks),
    exhaustMap(({ projectId }) =>
      this.projectService.getRisks(projectId).pipe(
        map((r) => ProjectsActions.loadRisksSuccess({ risks: r.data })),
        catchError((e) => of(ProjectsActions.loadRisksFailure({ error: e.error?.errors?.[0] ?? 'Failed to load risks' })))
      ))
  ));

  createRisk$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createRisk),
    exhaustMap(({ projectId, request }) =>
      this.projectService.createRisk(projectId, request).pipe(
        map((r) => ProjectsActions.createRiskSuccess({ risk: r.data })),
        catchError((e) => of(ProjectsActions.createRiskFailure({ error: e.error?.errors?.[0] ?? 'Failed to create risk' })))
      ))
  ));

  createRiskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.createRiskSuccess),
    tap(() => this.toastService.success('Risk created'))
  ), { dispatch: false });

  // Failure toasts
  failures$ = createEffect(() => this.actions$.pipe(
    ofType(
      ProjectsActions.loadProjectsFailure, ProjectsActions.loadProjectFailure,
      ProjectsActions.createProjectFailure, ProjectsActions.changeStatusFailure,
      ProjectsActions.loadMilestonesFailure, ProjectsActions.createMilestoneFailure,
      ProjectsActions.loadTasksFailure, ProjectsActions.createTaskFailure,
      ProjectsActions.loadRisksFailure, ProjectsActions.createRiskFailure
    ),
    tap(({ error }) => this.toastService.error(error))
  ), { dispatch: false });
}
