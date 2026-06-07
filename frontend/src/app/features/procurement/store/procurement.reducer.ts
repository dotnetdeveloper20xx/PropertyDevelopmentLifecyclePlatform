import { createReducer, on } from '@ngrx/store';
import { initialProcurementState } from './procurement.state';
import * as ProcurementActions from './procurement.actions';

export const procurementReducer = createReducer(
  initialProcurementState,

  // Load Orders
  on(ProcurementActions.loadOrders, (state) => ({
    ...state, ordersLoading: true, error: null
  })),
  on(ProcurementActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state, orders, ordersLoading: false
  })),
  on(ProcurementActions.loadOrdersFailure, (state, { error }) => ({
    ...state, ordersLoading: false, error
  })),

  // Create Order
  on(ProcurementActions.createOrder, (state) => ({
    ...state, ordersLoading: true, error: null
  })),
  on(ProcurementActions.createOrderSuccess, (state, { order }) => ({
    ...state, orders: [order, ...state.orders], ordersLoading: false
  })),
  on(ProcurementActions.createOrderFailure, (state, { error }) => ({
    ...state, ordersLoading: false, error
  })),

  // Load Deliveries
  on(ProcurementActions.loadDeliveries, (state) => ({
    ...state, deliveriesLoading: true, error: null
  })),
  on(ProcurementActions.loadDeliveriesSuccess, (state, { deliveries }) => ({
    ...state, deliveries, deliveriesLoading: false
  })),
  on(ProcurementActions.loadDeliveriesFailure, (state, { error }) => ({
    ...state, deliveriesLoading: false, error
  })),

  // Create Delivery
  on(ProcurementActions.createDelivery, (state) => ({
    ...state, deliveriesLoading: true, error: null
  })),
  on(ProcurementActions.createDeliverySuccess, (state, { delivery }) => ({
    ...state, deliveries: [delivery, ...state.deliveries], deliveriesLoading: false
  })),
  on(ProcurementActions.createDeliveryFailure, (state, { error }) => ({
    ...state, deliveriesLoading: false, error
  }))
);
