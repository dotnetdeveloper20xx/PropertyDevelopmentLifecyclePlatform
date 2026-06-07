import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ContractListItem, ContractDetail, LegalTaskItem, ComplianceCheckItem } from '../../../core/models/legal.model';

export const contractAdapter: EntityAdapter<ContractListItem> = createEntityAdapter<ContractListItem>({ selectId: (c) => c.id });

export interface LegalState extends EntityState<ContractListItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
  selectedContract: ContractDetail | null;
  selectedLoading: boolean;
  tasks: LegalTaskItem[];
  tasksLoading: boolean;
  tasksTotalCount: number;
  complianceChecks: ComplianceCheckItem[];
  complianceLoading: boolean;
}

export const initialLegalState: LegalState = contractAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0,
  selectedContract: null,
  selectedLoading: false,
  tasks: [],
  tasksLoading: false,
  tasksTotalCount: 0,
  complianceChecks: [],
  complianceLoading: false
});
