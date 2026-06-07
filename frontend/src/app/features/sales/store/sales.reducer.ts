import { createReducer, on } from '@ngrx/store';
import { initialSalesState, salesAdapter } from './sales.state';
import * as SalesActions from './sales.actions';

export const salesReducer = createReducer(
  initialSalesState,

  // Load Sales Leads
  on(SalesActions.loadSalesLeads, (state) => ({
    ...state, loading: true, error: null
  })),
  on(SalesActions.loadSalesLeadsSuccess, (state, { leads, totalCount }) =>
    salesAdapter.setAll(leads, { ...state, loading: false, totalCount })
  ),
  on(SalesActions.loadSalesLeadsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Sales Lead
  on(SalesActions.createSalesLead, (state) => ({
    ...state, loading: true, error: null
  })),
  on(SalesActions.createSalesLeadSuccess, (state, { lead }) =>
    salesAdapter.addOne(lead, { ...state, loading: false, totalCount: state.totalCount + 1 })
  ),
  on(SalesActions.createSalesLeadFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
