import { createReducer, on } from '@ngrx/store';
import { initialPortfolioState, portfolioAdapter } from './portfolio.state';
import * as PortfolioActions from './portfolio.actions';

export const portfolioReducer = createReducer(
  initialPortfolioState,

  // Load Portfolios
  on(PortfolioActions.loadPortfolios, (state) => ({
    ...state, loading: true, error: null
  })),
  on(PortfolioActions.loadPortfoliosSuccess, (state, { portfolios, totalCount }) =>
    portfolioAdapter.setAll(portfolios, { ...state, loading: false, totalCount })
  ),
  on(PortfolioActions.loadPortfoliosFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Portfolio
  on(PortfolioActions.createPortfolio, (state) => ({
    ...state, loading: true, error: null
  })),
  on(PortfolioActions.createPortfolioSuccess, (state, { portfolio }) =>
    portfolioAdapter.addOne(portfolio, { ...state, loading: false, totalCount: state.totalCount + 1 })
  ),
  on(PortfolioActions.createPortfolioFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
