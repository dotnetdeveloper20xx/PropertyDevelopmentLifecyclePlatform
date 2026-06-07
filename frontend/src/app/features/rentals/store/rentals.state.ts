import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TenancyItem } from '../../../core/models/rental.model';

export const rentalsAdapter: EntityAdapter<TenancyItem> =
  createEntityAdapter<TenancyItem>({ selectId: (tenancy) => tenancy.id });

export interface RentalsState extends EntityState<TenancyItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialRentalsState: RentalsState = rentalsAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0
});
