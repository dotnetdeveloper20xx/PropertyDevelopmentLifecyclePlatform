import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { InvestorItem } from '../../../core/models/investor.model';

export const investorsAdapter: EntityAdapter<InvestorItem> =
  createEntityAdapter<InvestorItem>({ selectId: (investor) => investor.id });

export interface InvestorsState extends EntityState<InvestorItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialInvestorsState: InvestorsState = investorsAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0
});
