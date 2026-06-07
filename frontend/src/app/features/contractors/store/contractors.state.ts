import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ContractorItem } from '../../../core/models/contractor.model';

export const contractorsAdapter: EntityAdapter<ContractorItem> =
  createEntityAdapter<ContractorItem>({ selectId: (contractor) => contractor.id });

export interface ContractorsState extends EntityState<ContractorItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialContractorsState: ContractorsState = contractorsAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0
});
