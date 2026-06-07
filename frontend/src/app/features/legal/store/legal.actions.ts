import { createAction, props } from '@ngrx/store';
import {
  ContractListItem, ContractDetail, CreateContractRequest, ContractStatus,
  LegalTaskItem, CreateLegalTaskRequest, LegalTaskStatus,
  ComplianceCheckItem, CreateComplianceCheckRequest
} from '../../../core/models/legal.model';

// Contracts List
export const loadContracts = createAction('[Legal] Load Contracts', props<{ page?: number; pageSize?: number; search?: string; status?: ContractStatus }>());
export const loadContractsSuccess = createAction('[Legal] Load Contracts Success', props<{ contracts: ContractListItem[]; totalCount: number }>());
export const loadContractsFailure = createAction('[Legal] Load Contracts Failure', props<{ error: string }>());

// Single Contract
export const loadContract = createAction('[Legal] Load Contract', props<{ id: string }>());
export const loadContractSuccess = createAction('[Legal] Load Contract Success', props<{ contract: ContractDetail }>());
export const loadContractFailure = createAction('[Legal] Load Contract Failure', props<{ error: string }>());

// Create Contract
export const createContract = createAction('[Legal] Create Contract', props<{ request: CreateContractRequest }>());
export const createContractSuccess = createAction('[Legal] Create Contract Success');
export const createContractFailure = createAction('[Legal] Create Contract Failure', props<{ error: string }>());

// Change Contract Status
export const changeContractStatus = createAction('[Legal] Change Contract Status', props<{ id: string; newStatus: ContractStatus }>());
export const changeContractStatusSuccess = createAction('[Legal] Change Contract Status Success');
export const changeContractStatusFailure = createAction('[Legal] Change Contract Status Failure', props<{ error: string }>());

// Legal Tasks
export const loadTasks = createAction('[Legal] Load Tasks', props<{ page?: number; pageSize?: number; search?: string; status?: LegalTaskStatus }>());
export const loadTasksSuccess = createAction('[Legal] Load Tasks Success', props<{ tasks: LegalTaskItem[]; totalCount: number }>());
export const loadTasksFailure = createAction('[Legal] Load Tasks Failure', props<{ error: string }>());

export const createTask = createAction('[Legal] Create Task', props<{ request: CreateLegalTaskRequest }>());
export const createTaskSuccess = createAction('[Legal] Create Task Success', props<{ task: LegalTaskItem }>());
export const createTaskFailure = createAction('[Legal] Create Task Failure', props<{ error: string }>());

export const changeTaskStatus = createAction('[Legal] Change Task Status', props<{ id: string; newStatus: LegalTaskStatus }>());
export const changeTaskStatusSuccess = createAction('[Legal] Change Task Status Success');
export const changeTaskStatusFailure = createAction('[Legal] Change Task Status Failure', props<{ error: string }>());

// Compliance
export const loadCompliance = createAction('[Legal] Load Compliance', props<{ opportunityId: string }>());
export const loadComplianceSuccess = createAction('[Legal] Load Compliance Success', props<{ checks: ComplianceCheckItem[] }>());
export const loadComplianceFailure = createAction('[Legal] Load Compliance Failure', props<{ error: string }>());

export const createComplianceCheck = createAction('[Legal] Create Compliance Check', props<{ opportunityId: string; request: CreateComplianceCheckRequest }>());
export const createComplianceCheckSuccess = createAction('[Legal] Create Compliance Check Success', props<{ check: ComplianceCheckItem }>());
export const createComplianceCheckFailure = createAction('[Legal] Create Compliance Check Failure', props<{ error: string }>());
