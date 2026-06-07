import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { PlanningApplicationService } from '../../../core/services/planning.service';
import { ToastService } from '../../../core/services/toast.service';
import * as PlanningActions from './planning.actions';

/**
 * NgRx Effects for Planning & Approvals.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class PlanningEffects {
  private actions$ = inject(Actions);
  private planningService = inject(PlanningApplicationService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.loadApplications),
      exhaustMap(({ page, pageSize, search, status }) =>
        this.planningService.getAll({ page, pageSize, search, status }).pipe(
          map((response) =>
            PlanningActions.loadApplicationsSuccess({
              applications: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(PlanningActions.loadApplicationsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load planning applications'
            }))
          )
        )
      )
    )
  );

  loadApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.loadApplication),
      exhaustMap(({ id }) =>
        this.planningService.getById(id).pipe(
          map((response) =>
            PlanningActions.loadApplicationSuccess({ application: response.data })
          ),
          catchError((error) =>
            of(PlanningActions.loadApplicationFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load application details'
            }))
          )
        )
      )
    )
  );

  createApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.createApplication),
      exhaustMap(({ request }) =>
        this.planningService.create(request).pipe(
          map(() => PlanningActions.createApplicationSuccess()),
          catchError((error) =>
            of(PlanningActions.createApplicationFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create planning application'
            }))
          )
        )
      )
    )
  );

  createApplicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.createApplicationSuccess),
      tap(() => {
        this.toastService.success('Planning application created successfully');
        this.router.navigate(['/planning']);
      })
    ), { dispatch: false }
  );

  updateApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.updateApplication),
      exhaustMap(({ id, request }) =>
        this.planningService.update(id, request).pipe(
          map(() => PlanningActions.updateApplicationSuccess()),
          catchError((error) =>
            of(PlanningActions.updateApplicationFailure({
              error: error.error?.errors?.[0] ?? 'Failed to update application'
            }))
          )
        )
      )
    )
  );

  updateApplicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.updateApplicationSuccess),
      tap(() => this.toastService.success('Planning application updated successfully'))
    ), { dispatch: false }
  );

  changeStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.changeStatus),
      exhaustMap(({ id, newStatus }) =>
        this.planningService.changeStatus(id, newStatus).pipe(
          map(() => PlanningActions.changeStatusSuccess()),
          catchError((error) =>
            of(PlanningActions.changeStatusFailure({
              error: error.error?.errors?.[0] ?? 'Failed to change status'
            }))
          )
        )
      )
    )
  );

  changeStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.changeStatusSuccess),
      tap(() => this.toastService.success('Application status updated'))
    ), { dispatch: false }
  );

  // Conditions
  loadConditions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.loadConditions),
      exhaustMap(({ applicationId }) =>
        this.planningService.getConditions(applicationId).pipe(
          map((response) =>
            PlanningActions.loadConditionsSuccess({ conditions: response.data })
          ),
          catchError((error) =>
            of(PlanningActions.loadConditionsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load conditions'
            }))
          )
        )
      )
    )
  );

  createCondition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.createCondition),
      exhaustMap(({ applicationId, request }) =>
        this.planningService.createCondition(applicationId, request).pipe(
          map((response) =>
            PlanningActions.createConditionSuccess({ condition: response.data })
          ),
          catchError((error) =>
            of(PlanningActions.createConditionFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create condition'
            }))
          )
        )
      )
    )
  );

  createConditionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.createConditionSuccess),
      tap(() => this.toastService.success('Condition added successfully'))
    ), { dispatch: false }
  );

  dischargeCondition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.dischargeCondition),
      exhaustMap(({ applicationId, conditionId, request }) =>
        this.planningService.dischargeCondition(applicationId, conditionId, request).pipe(
          map((response) =>
            PlanningActions.dischargeConditionSuccess({ condition: response.data })
          ),
          catchError((error) =>
            of(PlanningActions.dischargeConditionFailure({
              error: error.error?.errors?.[0] ?? 'Failed to discharge condition'
            }))
          )
        )
      )
    )
  );

  dischargeConditionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.dischargeConditionSuccess),
      tap(() => this.toastService.success('Condition discharged successfully'))
    ), { dispatch: false }
  );

  // Appeals
  loadAppeals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.loadAppeals),
      exhaustMap(({ applicationId }) =>
        this.planningService.getAppeals(applicationId).pipe(
          map((response) =>
            PlanningActions.loadAppealsSuccess({ appeals: response.data })
          ),
          catchError((error) =>
            of(PlanningActions.loadAppealsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load appeals'
            }))
          )
        )
      )
    )
  );

  createAppeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.createAppeal),
      exhaustMap(({ applicationId, request }) =>
        this.planningService.createAppeal(applicationId, request).pipe(
          map((response) =>
            PlanningActions.createAppealSuccess({ appeal: response.data })
          ),
          catchError((error) =>
            of(PlanningActions.createAppealFailure({
              error: error.error?.errors?.[0] ?? 'Failed to submit appeal'
            }))
          )
        )
      )
    )
  );

  createAppealSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningActions.createAppealSuccess),
      tap(() => this.toastService.success('Appeal submitted successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PlanningActions.loadApplicationsFailure,
        PlanningActions.loadApplicationFailure,
        PlanningActions.createApplicationFailure,
        PlanningActions.updateApplicationFailure,
        PlanningActions.changeStatusFailure,
        PlanningActions.createConditionFailure,
        PlanningActions.dischargeConditionFailure,
        PlanningActions.createAppealFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
