import { createReducer, on } from '@ngrx/store';
import { initialInvestorsState, investorsAdapter } from './investors.state';
import * as InvestorsActions from './investors.actions';

export const investorsReducer = createReducer(
  initialInvestorsState,

  // Load Investors
  on(InvestorsActions.loadInvestors, (state) => ({
    ...state, loading: true, error: null
  })),
  on(InvestorsActions.loadInvestorsSuccess, (state, { investors, totalCount }) =>
    investorsAdapter.setAll(investors, { ...state, loading: false, totalCount })
  ),
  on(InvestorsActions.loadInvestorsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Investor
  on(InvestorsActions.createInvestor, (state) => ({
    ...state, loading: true, error: null
  })),
  on(InvestorsActions.createInvestorSuccess, (state, { investor }) =>
    investorsAdapter.addOne(investor, { ...state, loading: false, totalCount: state.totalCount + 1 })
  ),
  on(InvestorsActions.createInvestorFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
