import { createAction, props } from '@ngrx/store';
import { PortfolioItem, CreatePortfolioRequest, PortfolioStatus, RiskLevel } from '../../../core/models/portfolio.model';

// Load Portfolios
export const loadPortfolios = createAction(
  '[Portfolio] Load Portfolios',
  props<{ page?: number; pageSize?: number; search?: string; status?: PortfolioStatus; riskLevel?: RiskLevel }>()
);
export const loadPortfoliosSuccess = createAction(
  '[Portfolio] Load Portfolios Success',
  props<{ portfolios: PortfolioItem[]; totalCount: number }>()
);
export const loadPortfoliosFailure = createAction(
  '[Portfolio] Load Portfolios Failure',
  props<{ error: string }>()
);

// Create Portfolio
export const createPortfolio = createAction(
  '[Portfolio] Create Portfolio',
  props<{ request: CreatePortfolioRequest }>()
);
export const createPortfolioSuccess = createAction(
  '[Portfolio] Create Portfolio Success',
  props<{ portfolio: PortfolioItem }>()
);
export const createPortfolioFailure = createAction(
  '[Portfolio] Create Portfolio Failure',
  props<{ error: string }>()
);
