import { createAction, props } from '@ngrx/store';
import { ContractorItem, CreateContractorRequest, ContractorType, ContractorStatus } from '../../../core/models/contractor.model';

// Load Contractors
export const loadContractors = createAction(
  '[Contractors] Load Contractors',
  props<{ page?: number; pageSize?: number; search?: string; type?: ContractorType; status?: ContractorStatus }>()
);
export const loadContractorsSuccess = createAction(
  '[Contractors] Load Contractors Success',
  props<{ contractors: ContractorItem[]; totalCount: number }>()
);
export const loadContractorsFailure = createAction(
  '[Contractors] Load Contractors Failure',
  props<{ error: string }>()
);

// Create Contractor
export const createContractor = createAction(
  '[Contractors] Create Contractor',
  props<{ request: CreateContractorRequest }>()
);
export const createContractorSuccess = createAction(
  '[Contractors] Create Contractor Success',
  props<{ contractor: ContractorItem }>()
);
export const createContractorFailure = createAction(
  '[Contractors] Create Contractor Failure',
  props<{ error: string }>()
);
