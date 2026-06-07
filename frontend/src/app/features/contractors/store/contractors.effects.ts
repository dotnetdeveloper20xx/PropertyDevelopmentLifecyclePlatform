import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { ContractorService } from '../../../core/services/contractor.service';
import { ToastService } from '../../../core/services/toast.service';
import * as ContractorsActions from './contractors.actions';

/**
 * NgRx Effects for Contractors & Suppliers.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class ContractorsEffects {
  private actions$ = inject(Actions);
  private contractorService = inject(ContractorService);
  private toastService = inject(ToastService);

  // Load Contractors
  loadContractors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractorsActions.loadContractors),
      exhaustMap(({ page, pageSize, search, type, status }) =>
        this.contractorService.getAll({ page, pageSize, search, type, status }).pipe(
          map((response) =>
            ContractorsActions.loadContractorsSuccess({
              contractors: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(ContractorsActions.loadContractorsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load contractors'
            }))
          )
        )
      )
    )
  );

  // Create Contractor
  createContractor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractorsActions.createContractor),
      exhaustMap(({ request }) =>
        this.contractorService.create(request).pipe(
          map((response) =>
            ContractorsActions.createContractorSuccess({ contractor: response.data })
          ),
          catchError((error) =>
            of(ContractorsActions.createContractorFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create contractor'
            }))
          )
        )
      )
    )
  );

  createContractorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContractorsActions.createContractorSuccess),
      tap(() => this.toastService.success('Contractor created successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ContractorsActions.loadContractorsFailure,
        ContractorsActions.createContractorFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
