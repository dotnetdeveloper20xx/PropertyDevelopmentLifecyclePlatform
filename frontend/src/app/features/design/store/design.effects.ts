import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { DesignService } from '../../../core/services/design.service';
import { ToastService } from '../../../core/services/toast.service';
import * as DesignActions from './design.actions';

@Injectable()
export class DesignEffects {
  private actions$ = inject(Actions);
  private svc = inject(DesignService);
  private toast = inject(ToastService);

  loadDesignPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DesignActions.loadDesignPackages),
      exhaustMap(({ projectId }) =>
        this.svc.getByProject(projectId).pipe(
          map((response) =>
            DesignActions.loadDesignPackagesSuccess({ packages: response.data })
          ),
          catchError((error) =>
            of(DesignActions.loadDesignPackagesFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load design packages'
            }))
          )
        )
      )
    )
  );

  createDesignPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DesignActions.createDesignPackage),
      exhaustMap(({ projectId, request }) =>
        this.svc.create(projectId, request).pipe(
          map((response) =>
            DesignActions.createDesignPackageSuccess({ designPackage: response.data })
          ),
          catchError((error) =>
            of(DesignActions.createDesignPackageFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create design package'
            }))
          )
        )
      )
    )
  );

  createDesignPackageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DesignActions.createDesignPackageSuccess),
      tap(() => this.toast.success('Design package created successfully'))
    ), { dispatch: false }
  );

  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DesignActions.loadDesignPackagesFailure,
        DesignActions.createDesignPackageFailure
      ),
      tap(({ error }) => this.toast.error(error))
    ), { dispatch: false }
  );
}
