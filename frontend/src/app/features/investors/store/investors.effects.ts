import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { InvestorService } from '../../../core/services/investor.service';
import { ToastService } from '../../../core/services/toast.service';
import * as InvestorsActions from './investors.actions';

/**
 * NgRx Effects for Investors & Funding.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class InvestorsEffects {
  private actions$ = inject(Actions);
  private investorService = inject(InvestorService);
  private toastService = inject(ToastService);

  // Load Investors
  loadInvestors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvestorsActions.loadInvestors),
      exhaustMap(({ page, pageSize, search, type, status }) =>
        this.investorService.getAll({ page, pageSize, search, type, status }).pipe(
          map((response) =>
            InvestorsActions.loadInvestorsSuccess({
              investors: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(InvestorsActions.loadInvestorsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load investors'
            }))
          )
        )
      )
    )
  );

  // Create Investor
  createInvestor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvestorsActions.createInvestor),
      exhaustMap(({ request }) =>
        this.investorService.create(request).pipe(
          map((response) =>
            InvestorsActions.createInvestorSuccess({ investor: response.data })
          ),
          catchError((error) =>
            of(InvestorsActions.createInvestorFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create investor'
            }))
          )
        )
      )
    )
  );

  createInvestorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvestorsActions.createInvestorSuccess),
      tap(() => this.toastService.success('Investor created successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InvestorsActions.loadInvestorsFailure,
        InvestorsActions.createInvestorFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
