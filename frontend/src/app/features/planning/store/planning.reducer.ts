import { createReducer, on } from '@ngrx/store';
import { initialPlanningState, planningAdapter } from './planning.state';
import * as PlanningActions from './planning.actions';

export const planningReducer = createReducer(
  initialPlanningState,

  // Load Applications
  on(PlanningActions.loadApplications, (state) => ({
    ...state, loading: true, error: null
  })),
  on(PlanningActions.loadApplicationsSuccess, (state, { applications, totalCount }) =>
    planningAdapter.setAll(applications, { ...state, loading: false, totalCount })
  ),
  on(PlanningActions.loadApplicationsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Load Single Application
  on(PlanningActions.loadApplication, (state) => ({
    ...state, selectedLoading: true, error: null
  })),
  on(PlanningActions.loadApplicationSuccess, (state, { application }) => ({
    ...state, selectedApplication: application, selectedLoading: false
  })),
  on(PlanningActions.loadApplicationFailure, (state, { error }) => ({
    ...state, selectedLoading: false, error
  })),

  // Create
  on(PlanningActions.createApplication, (state) => ({ ...state, loading: true })),
  on(PlanningActions.createApplicationSuccess, (state) => ({ ...state, loading: false })),
  on(PlanningActions.createApplicationFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Update
  on(PlanningActions.updateApplication, (state) => ({ ...state, loading: true })),
  on(PlanningActions.updateApplicationSuccess, (state) => ({ ...state, loading: false })),
  on(PlanningActions.updateApplicationFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Change Status
  on(PlanningActions.changeStatus, (state) => ({ ...state, loading: true })),
  on(PlanningActions.changeStatusSuccess, (state) => ({ ...state, loading: false })),
  on(PlanningActions.changeStatusFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Conditions
  on(PlanningActions.loadConditions, (state) => ({
    ...state, conditionsLoading: true
  })),
  on(PlanningActions.loadConditionsSuccess, (state, { conditions }) => ({
    ...state, conditions, conditionsLoading: false
  })),
  on(PlanningActions.loadConditionsFailure, (state) => ({
    ...state, conditionsLoading: false
  })),
  on(PlanningActions.createConditionSuccess, (state, { condition }) => ({
    ...state, conditions: [...state.conditions, condition]
  })),
  on(PlanningActions.dischargeConditionSuccess, (state, { condition }) => ({
    ...state,
    conditions: state.conditions.map(c => c.id === condition.id ? condition : c)
  })),

  // Appeals
  on(PlanningActions.loadAppeals, (state) => ({
    ...state, appealsLoading: true
  })),
  on(PlanningActions.loadAppealsSuccess, (state, { appeals }) => ({
    ...state, appeals, appealsLoading: false
  })),
  on(PlanningActions.loadAppealsFailure, (state) => ({
    ...state, appealsLoading: false
  })),
  on(PlanningActions.createAppealSuccess, (state, { appeal }) => ({
    ...state, appeals: [appeal, ...state.appeals]
  }))
);
