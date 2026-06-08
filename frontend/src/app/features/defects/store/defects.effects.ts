import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { DefectService } from '../../../core/services/defect.service';
import { ToastService } from '../../../core/services/toast.service';
import * as DefectsActions from './defects.actions';

@Injectable()
export class DefectsEffects {
  private actions$ = inject(Actions);
  private svc = inject(DefectService);
  private toast = inject(ToastService);

  loadDefects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DefectsActions.loadDefects),
      exhaustMap(({ page, pageSize, search, status, priority }) =>
        this.svc.getAll({ page, pageSize, search, status, priority }).pipe(
          map((response) =>
            DefectsActions.loadDefectsSuccess({
              defects: response.data,
              totalCount: response.pagination?.totalCount ?? response.data?.length ?? 0
            })
          ),
          catchError((error) =>
            of(DefectsActions.loadDefectsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load defects'
            }))
          )
        )
      )
    )
  );

  createDefect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DefectsActions.createDefect),
      exhaustMap(({ request }) =>
        this.svc.create(request).pipe(
          map((response) =>
            DefectsActions.createDefectSuccess({ defect: response.data })
          ),
          catchError((error) =>
            of(DefectsActions.createDefectFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create defect'
            }))
          )
        )
      )
    )
  );

  createDefectSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DefectsActions.createDefectSuccess),
      tap(() => this.toast.success('Defect reported successfully'))
    ), { dispatch: false }
  );

  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DefectsActions.loadDefectsFailure,
        DefectsActions.createDefectFailure
      ),
      tap(({ error }) => this.toast.error(error))
    ), { dispatch: false }
  );
}
