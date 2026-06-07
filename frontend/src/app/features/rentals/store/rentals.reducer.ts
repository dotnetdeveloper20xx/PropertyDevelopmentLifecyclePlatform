import { createReducer, on } from '@ngrx/store';
import { initialRentalsState, rentalsAdapter } from './rentals.state';
import * as RentalsActions from './rentals.actions';

export const rentalsReducer = createReducer(
  initialRentalsState,

  // Load Tenancies
  on(RentalsActions.loadTenancies, (state) => ({
    ...state, loading: true, error: null
  })),
  on(RentalsActions.loadTenanciesSuccess, (state, { tenancies, totalCount }) =>
    rentalsAdapter.setAll(tenancies, { ...state, loading: false, totalCount })
  ),
  on(RentalsActions.loadTenanciesFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Tenancy
  on(RentalsActions.createTenancy, (state) => ({
    ...state, loading: true, error: null
  })),
  on(RentalsActions.createTenancySuccess, (state, { tenancy }) =>
    rentalsAdapter.addOne(tenancy, { ...state, loading: false, totalCount: state.totalCount + 1 })
  ),
  on(RentalsActions.createTenancyFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
