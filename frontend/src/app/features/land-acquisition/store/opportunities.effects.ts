import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { OpportunityService } from '../../../core/services/opportunity.service';
import { ToastService } from '../../../core/services/toast.service';
import * as OpportunitiesActions from './opportunities.actions';

/**
 * NgRx Effects for Opportunities.
 * All API calls (side effects) live here — never in components.
 * Toast notifications provide user feedback on success/failure.
 */
@Injectable()
export class OpportunitiesEffects {
  private actions$ = inject(Actions);
  private opportunityService = inject(OpportunityService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loadOpportunities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OpportunitiesActions.loadOpportunities),
      exhaustMap(({ page, pageSize, search }) =>
        this.opportunityService.getAll({ page, pageSize, search }).pipe(
          map((response) =>
            OpportunitiesActions.loadOpportunitiesSuccess({
              opportunities: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(OpportunitiesActions.loadOpportunitiesFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load opportunities'
            }))
          )
        )
      )
    )
  );

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OpportunitiesActions.loadStats),
      exhaustMap(() =>
        this.opportunityService.getStats().pipe(
          map((response) => OpportunitiesActions.loadStatsSuccess({ stats: response.data })),
          catchError((error) =>
            of(OpportunitiesActions.loadStatsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load stats'
            }))
          )
        )
      )
    )
  );

  createOpportunity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OpportunitiesActions.createOpportunity),
      exhaustMap(({ request }) =>
        this.opportunityService.create(request).pipe(
          map(() => OpportunitiesActions.createOpportunitySuccess()),
          catchError((error) =>
            of(OpportunitiesActions.createOpportunityFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create opportunity'
            }))
          )
        )
      )
    )
  );

  createOpportunitySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OpportunitiesActions.createOpportunitySuccess),
      tap(() => {
        this.toastService.success('Opportunity created successfully');
        this.router.navigate(['/opportunities']);
      })
    ), { dispatch: false }
  );

  createOpportunityFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OpportunitiesActions.createOpportunityFailure),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );

  loadOpportunitiesFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OpportunitiesActions.loadOpportunitiesFailure),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
