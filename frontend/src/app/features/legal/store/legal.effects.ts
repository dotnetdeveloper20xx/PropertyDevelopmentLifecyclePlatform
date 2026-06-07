import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { LegalService } from '../../../core/services/legal.service';
import { ToastService } from '../../../core/services/toast.service';
import * as LegalActions from './legal.actions';

@Injectable()
export class LegalEffects {
  private actions$ = inject(Actions);
  private legalService = inject(LegalService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loadContracts$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.loadContracts),
    exhaustMap(({ page, pageSize, search, status }) =>
      this.legalService.getContracts({ page, pageSize, search, status }).pipe(
        map((r) => LegalActions.loadContractsSuccess({ contracts: r.data, totalCount: r.pagination?.totalCount ?? r.data?.length ?? 0 })),
        catchError((e) => of(LegalActions.loadContractsFailure({ error: e.error?.errors?.[0] ?? 'Failed to load contracts' })))
      ))
  ));

  loadContract$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.loadContract),
    exhaustMap(({ id }) =>
      this.legalService.getContractById(id).pipe(
        map((r) => LegalActions.loadContractSuccess({ contract: r.data })),
        catchError((e) => of(LegalActions.loadContractFailure({ error: e.error?.errors?.[0] ?? 'Failed to load contract' })))
      ))
  ));

  createContract$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.createContract),
    exhaustMap(({ request }) =>
      this.legalService.createContract(request).pipe(
        map(() => LegalActions.createContractSuccess()),
        catchError((e) => of(LegalActions.createContractFailure({ error: e.error?.errors?.[0] ?? 'Failed to create contract' })))
      ))
  ));

  createContractSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.createContractSuccess),
    tap(() => { this.toastService.success('Contract created successfully'); this.router.navigate(['/legal/contracts']); })
  ), { dispatch: false });

  changeContractStatus$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.changeContractStatus),
    exhaustMap(({ id, newStatus }) =>
      this.legalService.changeContractStatus(id, newStatus).pipe(
        map(() => LegalActions.changeContractStatusSuccess()),
        catchError((e) => of(LegalActions.changeContractStatusFailure({ error: e.error?.errors?.[0] ?? 'Failed to change status' })))
      ))
  ));

  changeContractStatusSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.changeContractStatusSuccess),
    tap(() => this.toastService.success('Contract status updated'))
  ), { dispatch: false });

  loadTasks$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.loadTasks),
    exhaustMap(({ page, pageSize, search, status }) =>
      this.legalService.getLegalTasks({ page, pageSize, search, status }).pipe(
        map((r) => LegalActions.loadTasksSuccess({ tasks: r.data, totalCount: r.pagination?.totalCount ?? r.data?.length ?? 0 })),
        catchError((e) => of(LegalActions.loadTasksFailure({ error: e.error?.errors?.[0] ?? 'Failed to load tasks' })))
      ))
  ));

  createTask$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.createTask),
    exhaustMap(({ request }) =>
      this.legalService.createLegalTask(request).pipe(
        map((r) => LegalActions.createTaskSuccess({ task: r.data })),
        catchError((e) => of(LegalActions.createTaskFailure({ error: e.error?.errors?.[0] ?? 'Failed to create task' })))
      ))
  ));

  createTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.createTaskSuccess),
    tap(() => this.toastService.success('Legal task created'))
  ), { dispatch: false });

  changeTaskStatus$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.changeTaskStatus),
    exhaustMap(({ id, newStatus }) =>
      this.legalService.changeLegalTaskStatus(id, newStatus).pipe(
        map(() => LegalActions.changeTaskStatusSuccess()),
        catchError((e) => of(LegalActions.changeTaskStatusFailure({ error: e.error?.errors?.[0] ?? 'Failed to change task status' })))
      ))
  ));

  changeTaskStatusSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.changeTaskStatusSuccess),
    tap(() => this.toastService.success('Task status updated'))
  ), { dispatch: false });

  loadCompliance$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.loadCompliance),
    exhaustMap(({ opportunityId }) =>
      this.legalService.getComplianceChecks(opportunityId).pipe(
        map((r) => LegalActions.loadComplianceSuccess({ checks: r.data })),
        catchError((e) => of(LegalActions.loadComplianceFailure({ error: e.error?.errors?.[0] ?? 'Failed to load compliance checks' })))
      ))
  ));

  createComplianceCheck$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.createComplianceCheck),
    exhaustMap(({ opportunityId, request }) =>
      this.legalService.createComplianceCheck(opportunityId, request).pipe(
        map((r) => LegalActions.createComplianceCheckSuccess({ check: r.data })),
        catchError((e) => of(LegalActions.createComplianceCheckFailure({ error: e.error?.errors?.[0] ?? 'Failed to create compliance check' })))
      ))
  ));

  createComplianceSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LegalActions.createComplianceCheckSuccess),
    tap(() => this.toastService.success('Compliance check created'))
  ), { dispatch: false });

  failures$ = createEffect(() => this.actions$.pipe(
    ofType(
      LegalActions.loadContractsFailure, LegalActions.loadContractFailure,
      LegalActions.createContractFailure, LegalActions.changeContractStatusFailure,
      LegalActions.loadTasksFailure, LegalActions.createTaskFailure, LegalActions.changeTaskStatusFailure,
      LegalActions.loadComplianceFailure, LegalActions.createComplianceCheckFailure
    ),
    tap(({ error }) => this.toastService.error(error))
  ), { dispatch: false });
}
