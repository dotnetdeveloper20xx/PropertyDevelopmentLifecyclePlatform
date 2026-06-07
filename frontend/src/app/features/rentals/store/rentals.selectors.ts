import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RentalsState, rentalsAdapter } from './rentals.state';

const selectRentalsState = createFeatureSelector<RentalsState>('rentals');

const { selectAll } = rentalsAdapter.getSelectors();

export const selectAllTenancies = createSelector(selectRentalsState, selectAll);
export const selectRentalsLoading = createSelector(selectRentalsState, (state) => state.loading);
export const selectRentalsError = createSelector(selectRentalsState, (state) => state.error);
export const selectRentalsTotalCount = createSelector(selectRentalsState, (state) => state.totalCount);
