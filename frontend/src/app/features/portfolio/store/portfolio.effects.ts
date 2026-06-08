import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import * as PortfolioActions from './portfolio.actions';

@Injectable()
export class PortfolioEffects {
  private actions$ = inject(Actions);
  private svc = inject(PortfolioService);
  private toast = inject(ToastService);

  loadPortfolios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadPortfolios),
      exhaustMap(({ page, pageSize, search, status, riskLevel }) =>
        this.svc.getAll({ page, pageSize, search, status, riskLevel }).pipe(
          map((response) =>
            PortfolioActions.loadPortfoliosSuccess({
              portfolios: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(PortfolioActions.loadPortfoliosFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load portfolios'
            }))
          )
        )
      )
    )
  );

  createPortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.createPortfolio),
      exhaustMap(({ request }) =>
        this.svc.create(request).pipe(
          map((response) =>
            PortfolioActions.createPortfolioSuccess({ portfolio: response.data })
          ),
          catchError((error) =>
            of(PortfolioActions.createPortfolioFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create portfolio'
            }))
          )
        )
      )
    )
  );

  createPortfolioSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.createPortfolioSuccess),
      tap(() => this.toast.success('Portfolio strategy created successfully'))
    ), { dispatch: false }
  );

  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PortfolioActions.loadPortfoliosFailure,
        PortfolioActions.createPortfolioFailure
      ),
      tap(({ error }) => this.toast.error(error))
    ), { dispatch: false }
  );
}
