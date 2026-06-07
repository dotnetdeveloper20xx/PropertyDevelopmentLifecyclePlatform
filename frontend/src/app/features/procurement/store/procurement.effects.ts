import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { ProcurementService } from '../../../core/services/procurement.service';
import { ToastService } from '../../../core/services/toast.service';
import * as ProcurementActions from './procurement.actions';

/**
 * NgRx Effects for Procurement & Materials.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class ProcurementEffects {
  private actions$ = inject(Actions);
  private procurementService = inject(ProcurementService);
  private toastService = inject(ToastService);

  // Load Purchase Orders
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcurementActions.loadOrders),
      exhaustMap(({ projectId }) =>
        this.procurementService.getPurchaseOrders(projectId).pipe(
          map((response) =>
            ProcurementActions.loadOrdersSuccess({ orders: response.data })
          ),
          catchError((error) =>
            of(ProcurementActions.loadOrdersFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load purchase orders'
            }))
          )
        )
      )
    )
  );

  // Create Purchase Order
  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcurementActions.createOrder),
      exhaustMap(({ projectId, request }) =>
        this.procurementService.createPurchaseOrder(projectId, request).pipe(
          map((response) =>
            ProcurementActions.createOrderSuccess({ order: response.data })
          ),
          catchError((error) =>
            of(ProcurementActions.createOrderFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create purchase order'
            }))
          )
        )
      )
    )
  );

  createOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcurementActions.createOrderSuccess),
      tap(() => this.toastService.success('Purchase order created successfully'))
    ), { dispatch: false }
  );

  // Load Deliveries
  loadDeliveries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcurementActions.loadDeliveries),
      exhaustMap(({ orderId }) =>
        this.procurementService.getDeliveries(orderId).pipe(
          map((response) =>
            ProcurementActions.loadDeliveriesSuccess({ deliveries: response.data })
          ),
          catchError((error) =>
            of(ProcurementActions.loadDeliveriesFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load deliveries'
            }))
          )
        )
      )
    )
  );

  // Create Delivery
  createDelivery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcurementActions.createDelivery),
      exhaustMap(({ orderId, request }) =>
        this.procurementService.createDelivery(orderId, request).pipe(
          map((response) =>
            ProcurementActions.createDeliverySuccess({ delivery: response.data })
          ),
          catchError((error) =>
            of(ProcurementActions.createDeliveryFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create delivery'
            }))
          )
        )
      )
    )
  );

  createDeliverySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcurementActions.createDeliverySuccess),
      tap(() => this.toastService.success('Delivery recorded successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ProcurementActions.loadOrdersFailure,
        ProcurementActions.createOrderFailure,
        ProcurementActions.loadDeliveriesFailure,
        ProcurementActions.createDeliveryFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
