import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortfolioState, portfolioAdapter } from './portfolio.state';

const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');

const { selectAll } = portfolioAdapter.getSelectors();

export const selectAllPortfolios = createSelector(selectPortfolioState, selectAll);
export const selectPortfolioLoading = createSelector(selectPortfolioState, (state) => state.loading);
export const selectPortfolioError = createSelector(selectPortfolioState, (state) => state.error);
export const selectPortfolioTotalCount = createSelector(selectPortfolioState, (state) => state.totalCount);
