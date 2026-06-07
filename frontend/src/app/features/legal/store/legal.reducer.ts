import { createReducer, on } from '@ngrx/store';
import { initialLegalState, contractAdapter } from './legal.state';
import * as LegalActions from './legal.actions';

export const legalReducer = createReducer(
  initialLegalState,

  on(LegalActions.loadContracts, (state) => ({ ...state, loading: true, error: null })),
  on(LegalActions.loadContractsSuccess, (state, { contracts, totalCount }) =>
    contractAdapter.setAll(contracts, { ...state, loading: false, totalCount })),
  on(LegalActions.loadContractsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LegalActions.loadContract, (state) => ({ ...state, selectedLoading: true, error: null })),
  on(LegalActions.loadContractSuccess, (state, { contract }) => ({ ...state, selectedContract: contract, selectedLoading: false })),
  on(LegalActions.loadContractFailure, (state, { error }) => ({ ...state, selectedLoading: false, error })),

  on(LegalActions.createContract, (state) => ({ ...state, loading: true })),
  on(LegalActions.createContractSuccess, (state) => ({ ...state, loading: false })),
  on(LegalActions.createContractFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LegalActions.changeContractStatus, (state) => ({ ...state, loading: true })),
  on(LegalActions.changeContractStatusSuccess, (state) => ({ ...state, loading: false })),
  on(LegalActions.changeContractStatusFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LegalActions.loadTasks, (state) => ({ ...state, tasksLoading: true })),
  on(LegalActions.loadTasksSuccess, (state, { tasks, totalCount }) => ({ ...state, tasks, tasksLoading: false, tasksTotalCount: totalCount })),
  on(LegalActions.loadTasksFailure, (state) => ({ ...state, tasksLoading: false })),
  on(LegalActions.createTaskSuccess, (state, { task }) => ({ ...state, tasks: [task, ...state.tasks] })),

  on(LegalActions.loadCompliance, (state) => ({ ...state, complianceLoading: true })),
  on(LegalActions.loadComplianceSuccess, (state, { checks }) => ({ ...state, complianceChecks: checks, complianceLoading: false })),
  on(LegalActions.loadComplianceFailure, (state) => ({ ...state, complianceLoading: false })),
  on(LegalActions.createComplianceCheckSuccess, (state, { check }) => ({
    ...state, complianceChecks: [...state.complianceChecks, check]
  }))
);
