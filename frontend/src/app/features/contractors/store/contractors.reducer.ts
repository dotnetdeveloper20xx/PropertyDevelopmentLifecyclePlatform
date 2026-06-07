import { createReducer, on } from '@ngrx/store';
import { initialContractorsState, contractorsAdapter } from './contractors.state';
import * as ContractorsActions from './contractors.actions';

export const contractorsReducer = createReducer(
  initialContractorsState,

  // Load Contractors
  on(ContractorsActions.loadContractors, (state) => ({
    ...state, loading: true, error: null
  })),
  on(ContractorsActions.loadContractorsSuccess, (state, { contractors, totalCount }) =>
    contractorsAdapter.setAll(contractors, { ...state, loading: false, totalCount })
  ),
  on(ContractorsActions.loadContractorsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Contractor
  on(ContractorsActions.createContractor, (state) => ({
    ...state, loading: true, error: null
  })),
  on(ContractorsActions.createContractorSuccess, (state, { contractor }) =>
    contractorsAdapter.addOne(contractor, { ...state, loading: false, totalCount: state.totalCount + 1 })
  ),
  on(ContractorsActions.createContractorFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
