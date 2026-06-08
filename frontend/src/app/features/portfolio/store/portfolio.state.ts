import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PortfolioItem } from '../../../core/models/portfolio.model';

export const portfolioAdapter: EntityAdapter<PortfolioItem> =
  createEntityAdapter<PortfolioItem>({ selectId: (item) => item.id });

export interface PortfolioState extends EntityState<PortfolioItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialPortfolioState: PortfolioState = portfolioAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0
});
