import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { FinanceService } from '../../../core/services/finance.service';
import { ToastService } from '../../../core/services/toast.service';
import * as FinanceActions from './finance.actions';

/**
 * NgRx Effects for Finance & Budget Control.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class FinanceEffects {
  private actions$ = inject(Actions);
  private financeService = inject(FinanceService);
  private toastService = inject(ToastService);

  // Load Budget Lines
  loadBudgetLines$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinanceActions.loadBudgetLines),
      exhaustMap(({ projectId }) =>
        this.financeService.getBudgetLines(projectId).pipe(
          map((response) =>
            FinanceActions.loadBudgetLinesSuccess({ budgetLines: response.data })
          ),
          catchError((error) =>
            of(FinanceActions.loadBudgetLinesFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load budget lines'
            }))
          )
        )
      )
    )
  );

  // Create Budget Line
  createBudgetLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinanceActions.createBudgetLine),
      exhaustMap(({ projectId, request }) =>
        this.financeService.createBudgetLine(projectId, request).pipe(
          map((response) =>
            FinanceActions.createBudgetLineSuccess({ budgetLine: response.data })
          ),
          catchError((error) =>
            of(FinanceActions.createBudgetLineFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create budget line'
            }))
          )
        )
      )
    )
  );

  createBudgetLineSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinanceActions.createBudgetLineSuccess),
      tap(() => this.toastService.success('Budget line created successfully'))
    ), { dispatch: false }
  );

  // Load Transactions
  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinanceActions.loadTransactions),
      exhaustMap(({ projectId }) =>
        this.financeService.getTransactions(projectId).pipe(
          map((response) =>
            FinanceActions.loadTransactionsSuccess({ transactions: response.data })
          ),
          catchError((error) =>
            of(FinanceActions.loadTransactionsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load transactions'
            }))
          )
        )
      )
    )
  );

  // Create Transaction
  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinanceActions.createTransaction),
      exhaustMap(({ projectId, request }) =>
        this.financeService.createTransaction(projectId, request).pipe(
          map((response) =>
            FinanceActions.createTransactionSuccess({ transaction: response.data })
          ),
          catchError((error) =>
            of(FinanceActions.createTransactionFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create transaction'
            }))
          )
        )
      )
    )
  );

  createTransactionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinanceActions.createTransactionSuccess),
      tap(() => this.toastService.success('Transaction recorded successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        FinanceActions.loadBudgetLinesFailure,
        FinanceActions.createBudgetLineFailure,
        FinanceActions.loadTransactionsFailure,
        FinanceActions.createTransactionFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
