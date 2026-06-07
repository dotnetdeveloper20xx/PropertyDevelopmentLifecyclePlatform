import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { SalesLeadItem } from '../../../core/models/sales.model';

export const salesAdapter: EntityAdapter<SalesLeadItem> =
  createEntityAdapter<SalesLeadItem>({ selectId: (lead) => lead.id });

export interface SalesState extends EntityState<SalesLeadItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialSalesState: SalesState = salesAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0
});
