import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { UnitService } from '../../../core/services/unit.service';
import { ToastService } from '../../../core/services/toast.service';
import * as UnitsActions from './units.actions';

/**
 * NgRx Effects for Property Units.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class UnitsEffects {
  private actions$ = inject(Actions);
  private unitService = inject(UnitService);
  private toastService = inject(ToastService);

  // Load Units
  loadUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.loadUnits),
      exhaustMap(({ projectId }) =>
        this.unitService.getByProject(projectId).pipe(
          map((response) =>
            UnitsActions.loadUnitsSuccess({ units: response.data })
          ),
          catchError((error) =>
            of(UnitsActions.loadUnitsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load units'
            }))
          )
        )
      )
    )
  );

  // Create Unit
  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.createUnit),
      exhaustMap(({ projectId, request }) =>
        this.unitService.create(projectId, request).pipe(
          map((response) =>
            UnitsActions.createUnitSuccess({ unit: response.data })
          ),
          catchError((error) =>
            of(UnitsActions.createUnitFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create unit'
            }))
          )
        )
      )
    )
  );

  createUnitSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.createUnitSuccess),
      tap(() => this.toastService.success('Unit created successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UnitsActions.loadUnitsFailure,
        UnitsActions.createUnitFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
