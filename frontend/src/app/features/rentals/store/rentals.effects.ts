import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { RentalService } from '../../../core/services/rental.service';
import { ToastService } from '../../../core/services/toast.service';
import * as RentalsActions from './rentals.actions';

/**
 * NgRx Effects for Rental Management.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class RentalsEffects {
  private actions$ = inject(Actions);
  private rentalService = inject(RentalService);
  private toastService = inject(ToastService);

  // Load Tenancies
  loadTenancies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentalsActions.loadTenancies),
      exhaustMap(({ page, pageSize, search, status }) =>
        this.rentalService.getAll({ page, pageSize, search, status }).pipe(
          map((response) =>
            RentalsActions.loadTenanciesSuccess({
              tenancies: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(RentalsActions.loadTenanciesFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load tenancies'
            }))
          )
        )
      )
    )
  );

  // Create Tenancy
  createTenancy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentalsActions.createTenancy),
      exhaustMap(({ request }) =>
        this.rentalService.create(request).pipe(
          map((response) =>
            RentalsActions.createTenancySuccess({ tenancy: response.data })
          ),
          catchError((error) =>
            of(RentalsActions.createTenancyFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create tenancy'
            }))
          )
        )
      )
    )
  );

  createTenancySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentalsActions.createTenancySuccess),
      tap(() => this.toastService.success('Tenancy created successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        RentalsActions.loadTenanciesFailure,
        RentalsActions.createTenancyFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
