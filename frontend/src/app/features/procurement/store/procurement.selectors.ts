import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProcurementState } from './procurement.state';

const selectProcurementState = createFeatureSelector<ProcurementState>('procurement');

export const selectOrders = createSelector(selectProcurementState, (state) => state.orders);
export const selectOrdersLoading = createSelector(selectProcurementState, (state) => state.ordersLoading);
export const selectDeliveries = createSelector(selectProcurementState, (state) => state.deliveries);
export const selectDeliveriesLoading = createSelector(selectProcurementState, (state) => state.deliveriesLoading);
export const selectProcurementError = createSelector(selectProcurementState, (state) => state.error);
