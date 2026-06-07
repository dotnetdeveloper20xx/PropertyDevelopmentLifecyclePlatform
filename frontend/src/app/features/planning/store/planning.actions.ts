import { createAction, props } from '@ngrx/store';
import {
  PlanningApplicationListItem,
  PlanningApplicationDetail,
  CreatePlanningApplicationRequest,
  UpdatePlanningApplicationRequest,
  PlanningApplicationStatus,
  PlanningCondition,
  CreateConditionRequest,
  DischargeConditionRequest,
  PlanningAppeal,
  CreateAppealRequest
} from '../../../core/models/planning.model';

// Load Planning Applications
export const loadApplications = createAction(
  '[Planning] Load Applications',
  props<{ page?: number; pageSize?: number; search?: string; status?: PlanningApplicationStatus }>()
);
export const loadApplicationsSuccess = createAction(
  '[Planning] Load Applications Success',
  props<{ applications: PlanningApplicationListItem[]; totalCount: number }>()
);
export const loadApplicationsFailure = createAction(
  '[Planning] Load Applications Failure',
  props<{ error: string }>()
);

// Load Single Application
export const loadApplication = createAction(
  '[Planning] Load Application',
  props<{ id: string }>()
);
export const loadApplicationSuccess = createAction(
  '[Planning] Load Application Success',
  props<{ application: PlanningApplicationDetail }>()
);
export const loadApplicationFailure = createAction(
  '[Planning] Load Application Failure',
  props<{ error: string }>()
);

// Create
export const createApplication = createAction(
  '[Planning] Create Application',
  props<{ request: CreatePlanningApplicationRequest }>()
);
export const createApplicationSuccess = createAction('[Planning] Create Application Success');
export const createApplicationFailure = createAction(
  '[Planning] Create Application Failure',
  props<{ error: string }>()
);

// Update
export const updateApplication = createAction(
  '[Planning] Update Application',
  props<{ id: string; request: UpdatePlanningApplicationRequest }>()
);
export const updateApplicationSuccess = createAction('[Planning] Update Application Success');
export const updateApplicationFailure = createAction(
  '[Planning] Update Application Failure',
  props<{ error: string }>()
);

// Change Status
export const changeStatus = createAction(
  '[Planning] Change Status',
  props<{ id: string; newStatus: PlanningApplicationStatus }>()
);
export const changeStatusSuccess = createAction('[Planning] Change Status Success');
export const changeStatusFailure = createAction(
  '[Planning] Change Status Failure',
  props<{ error: string }>()
);

// Conditions
export const loadConditions = createAction(
  '[Planning] Load Conditions',
  props<{ applicationId: string }>()
);
export const loadConditionsSuccess = createAction(
  '[Planning] Load Conditions Success',
  props<{ conditions: PlanningCondition[] }>()
);
export const loadConditionsFailure = createAction(
  '[Planning] Load Conditions Failure',
  props<{ error: string }>()
);

export const createCondition = createAction(
  '[Planning] Create Condition',
  props<{ applicationId: string; request: CreateConditionRequest }>()
);
export const createConditionSuccess = createAction(
  '[Planning] Create Condition Success',
  props<{ condition: PlanningCondition }>()
);
export const createConditionFailure = createAction(
  '[Planning] Create Condition Failure',
  props<{ error: string }>()
);

export const dischargeCondition = createAction(
  '[Planning] Discharge Condition',
  props<{ applicationId: string; conditionId: string; request: DischargeConditionRequest }>()
);
export const dischargeConditionSuccess = createAction(
  '[Planning] Discharge Condition Success',
  props<{ condition: PlanningCondition }>()
);
export const dischargeConditionFailure = createAction(
  '[Planning] Discharge Condition Failure',
  props<{ error: string }>()
);

// Appeals
export const loadAppeals = createAction(
  '[Planning] Load Appeals',
  props<{ applicationId: string }>()
);
export const loadAppealsSuccess = createAction(
  '[Planning] Load Appeals Success',
  props<{ appeals: PlanningAppeal[] }>()
);
export const loadAppealsFailure = createAction(
  '[Planning] Load Appeals Failure',
  props<{ error: string }>()
);

export const createAppeal = createAction(
  '[Planning] Create Appeal',
  props<{ applicationId: string; request: CreateAppealRequest }>()
);
export const createAppealSuccess = createAction(
  '[Planning] Create Appeal Success',
  props<{ appeal: PlanningAppeal }>()
);
export const createAppealFailure = createAction(
  '[Planning] Create Appeal Failure',
  props<{ error: string }>()
);
