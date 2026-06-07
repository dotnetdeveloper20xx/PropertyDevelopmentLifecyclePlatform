import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { ConstructionService } from '../../../core/services/construction.service';
import { ToastService } from '../../../core/services/toast.service';
import * as A from './construction.actions';

@Injectable()
export class ConstructionEffects {
  private actions$ = inject(Actions);
  private svc = inject(ConstructionService);
  private toast = inject(ToastService);

  loadStages$ = createEffect(() => this.actions$.pipe(
    ofType(A.loadStages),
    exhaustMap(({ projectId }) => this.svc.getStages(projectId).pipe(
      map(r => A.loadStagesSuccess({ stages: r.data })),
      catchError(e => of(A.loadStagesFailure({ error: e.error?.errors?.[0] ?? 'Failed to load stages' })))
    ))
  ));

  createStage$ = createEffect(() => this.actions$.pipe(
    ofType(A.createStage),
    exhaustMap(({ projectId, request }) => this.svc.createStage(projectId, request).pipe(
      map(r => A.createStageSuccess({ stage: r.data })),
      catchError(e => of(A.createStageFailure({ error: e.error?.errors?.[0] ?? 'Failed to create stage' })))
    ))
  ));

  createStageSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(A.createStageSuccess), tap(() => this.toast.success('Construction stage created'))
  ), { dispatch: false });

  loadInspections$ = createEffect(() => this.actions$.pipe(
    ofType(A.loadInspections),
    exhaustMap(({ stageId }) => this.svc.getInspections(stageId).pipe(
      map(r => A.loadInspectionsSuccess({ inspections: r.data })),
      catchError(e => of(A.loadInspectionsFailure({ error: e.error?.errors?.[0] ?? 'Failed to load inspections' })))
    ))
  ));

  createInspection$ = createEffect(() => this.actions$.pipe(
    ofType(A.createInspection),
    exhaustMap(({ stageId, request }) => this.svc.createInspection(stageId, request).pipe(
      map(r => A.createInspectionSuccess({ inspection: r.data })),
      catchError(e => of(A.createInspectionFailure({ error: e.error?.errors?.[0] ?? 'Failed to create inspection' })))
    ))
  ));

  createInspectionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(A.createInspectionSuccess), tap(() => this.toast.success('Inspection scheduled'))
  ), { dispatch: false });

  loadSnags$ = createEffect(() => this.actions$.pipe(
    ofType(A.loadSnags),
    exhaustMap(({ stageId }) => this.svc.getSnags(stageId).pipe(
      map(r => A.loadSnagsSuccess({ snags: r.data })),
      catchError(e => of(A.loadSnagsFailure({ error: e.error?.errors?.[0] ?? 'Failed to load snags' })))
    ))
  ));

  createSnag$ = createEffect(() => this.actions$.pipe(
    ofType(A.createSnag),
    exhaustMap(({ stageId, request }) => this.svc.createSnag(stageId, request).pipe(
      map(r => A.createSnagSuccess({ snag: r.data })),
      catchError(e => of(A.createSnagFailure({ error: e.error?.errors?.[0] ?? 'Failed to create snag' })))
    ))
  ));

  createSnagSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(A.createSnagSuccess), tap(() => this.toast.success('Snag recorded'))
  ), { dispatch: false });

  failures$ = createEffect(() => this.actions$.pipe(
    ofType(A.loadStagesFailure, A.createStageFailure, A.loadInspectionsFailure, A.createInspectionFailure, A.loadSnagsFailure, A.createSnagFailure),
    tap(({ error }) => this.toast.error(error))
  ), { dispatch: false });
}
