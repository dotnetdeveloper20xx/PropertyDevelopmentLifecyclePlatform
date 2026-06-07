import { createAction, props } from '@ngrx/store';
import {
  PurchaseOrderItem, CreatePurchaseOrderRequest,
  DeliveryItem, CreateDeliveryRequest
} from '../../../core/models/procurement.model';

// Load Purchase Orders
export const loadOrders = createAction(
  '[Procurement] Load Orders',
  props<{ projectId: string }>()
);
export const loadOrdersSuccess = createAction(
  '[Procurement] Load Orders Success',
  props<{ orders: PurchaseOrderItem[] }>()
);
export const loadOrdersFailure = createAction(
  '[Procurement] Load Orders Failure',
  props<{ error: string }>()
);

// Create Purchase Order
export const createOrder = createAction(
  '[Procurement] Create Order',
  props<{ projectId: string; request: CreatePurchaseOrderRequest }>()
);
export const createOrderSuccess = createAction(
  '[Procurement] Create Order Success',
  props<{ order: PurchaseOrderItem }>()
);
export const createOrderFailure = createAction(
  '[Procurement] Create Order Failure',
  props<{ error: string }>()
);

// Load Deliveries
export const loadDeliveries = createAction(
  '[Procurement] Load Deliveries',
  props<{ orderId: string }>()
);
export const loadDeliveriesSuccess = createAction(
  '[Procurement] Load Deliveries Success',
  props<{ deliveries: DeliveryItem[] }>()
);
export const loadDeliveriesFailure = createAction(
  '[Procurement] Load Deliveries Failure',
  props<{ error: string }>()
);

// Create Delivery
export const createDelivery = createAction(
  '[Procurement] Create Delivery',
  props<{ orderId: string; request: CreateDeliveryRequest }>()
);
export const createDeliverySuccess = createAction(
  '[Procurement] Create Delivery Success',
  props<{ delivery: DeliveryItem }>()
);
export const createDeliveryFailure = createAction(
  '[Procurement] Create Delivery Failure',
  props<{ error: string }>()
);
