import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { SalesService } from '../../../core/services/sales.service';
import { ToastService } from '../../../core/services/toast.service';
import * as SalesActions from './sales.actions';

/**
 * NgRx Effects for Sales & Conveyancing.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class SalesEffects {
  private actions$ = inject(Actions);
  private salesService = inject(SalesService);
  private toastService = inject(ToastService);

  // Load Sales Leads
  loadSalesLeads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSalesLeads),
      exhaustMap(({ page, pageSize, search, status }) =>
        this.salesService.getAll({ page, pageSize, search, status }).pipe(
          map((response) =>
            SalesActions.loadSalesLeadsSuccess({
              leads: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(SalesActions.loadSalesLeadsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load sales leads'
            }))
          )
        )
      )
    )
  );

  // Create Sales Lead
  createSalesLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.createSalesLead),
      exhaustMap(({ request }) =>
        this.salesService.create(request).pipe(
          map((response) =>
            SalesActions.createSalesLeadSuccess({ lead: response.data })
          ),
          catchError((error) =>
            of(SalesActions.createSalesLeadFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create sales lead'
            }))
          )
        )
      )
    )
  );

  createSalesLeadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.createSalesLeadSuccess),
      tap(() => this.toastService.success('Sales lead created successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SalesActions.loadSalesLeadsFailure,
        SalesActions.createSalesLeadFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
