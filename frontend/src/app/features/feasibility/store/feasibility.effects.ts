import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { FeasibilityService } from '../../../core/services/feasibility.service';
import { ToastService } from '../../../core/services/toast.service';
import * as FeasibilityActions from './feasibility.actions';

@Injectable()
export class FeasibilityEffects {
  private actions$ = inject(Actions);
  private svc = inject(FeasibilityService);
  private toast = inject(ToastService);

  loadFeasibility$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeasibilityActions.loadFeasibility),
      exhaustMap(({ opportunityId }) =>
        this.svc.getByOpportunity(opportunityId).pipe(
          map((response) =>
            FeasibilityActions.loadFeasibilitySuccess({ assessments: response.data })
          ),
          catchError((error) =>
            of(FeasibilityActions.loadFeasibilityFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load feasibility assessments'
            }))
          )
        )
      )
    )
  );

  createFeasibility$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeasibilityActions.createFeasibility),
      exhaustMap(({ opportunityId, request }) =>
        this.svc.create(opportunityId, request).pipe(
          map((response) =>
            FeasibilityActions.createFeasibilitySuccess({ assessment: response.data })
          ),
          catchError((error) =>
            of(FeasibilityActions.createFeasibilityFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create feasibility assessment'
            }))
          )
        )
      )
    )
  );

  createFeasibilitySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeasibilityActions.createFeasibilitySuccess),
      tap(() => this.toast.success('Feasibility assessment created successfully'))
    ), { dispatch: false }
  );

  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        FeasibilityActions.loadFeasibilityFailure,
        FeasibilityActions.createFeasibilityFailure
      ),
      tap(({ error }) => this.toast.error(error))
    ), { dispatch: false }
  );
}
