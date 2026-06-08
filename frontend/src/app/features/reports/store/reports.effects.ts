import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { ReportService } from '../../../core/services/report.service';
import { ToastService } from '../../../core/services/toast.service';
import * as ReportsActions from './reports.actions';

/**
 * NgRx Effects for Reports & Dashboards module.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class ReportsEffects {
  private actions$ = inject(Actions);
  private reportService = inject(ReportService);
  private toastService = inject(ToastService);

  // Load Reports
  loadReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.loadReports),
      exhaustMap(({ page, pageSize, search }) =>
        this.reportService.getAll({ page, pageSize, search }).pipe(
          map((response) =>
            ReportsActions.loadReportsSuccess({
              reports: response.data,
              totalCount: response.pagination?.totalCount ?? response.data.length
            })
          ),
          catchError((error) =>
            of(ReportsActions.loadReportsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load reports'
            }))
          )
        )
      )
    )
  );

  // Create Report
  createReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.createReport),
      exhaustMap(({ request }) =>
        this.reportService.create(request).pipe(
          map((response) =>
            ReportsActions.createReportSuccess({ report: response.data })
          ),
          catchError((error) =>
            of(ReportsActions.createReportFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create report'
            }))
          )
        )
      )
    )
  );

  createReportSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.createReportSuccess),
      tap(() => this.toastService.success('Report created successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReportsActions.loadReportsFailure,
        ReportsActions.createReportFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
