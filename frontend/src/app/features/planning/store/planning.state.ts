import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PlanningApplicationListItem, PlanningApplicationDetail, PlanningCondition, PlanningAppeal } from '../../../core/models/planning.model';

export const planningAdapter: EntityAdapter<PlanningApplicationListItem> =
  createEntityAdapter<PlanningApplicationListItem>({ selectId: (app) => app.id });

export interface PlanningState extends EntityState<PlanningApplicationListItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
  selectedApplication: PlanningApplicationDetail | null;
  selectedLoading: boolean;
  conditions: PlanningCondition[];
  conditionsLoading: boolean;
  appeals: PlanningAppeal[];
  appealsLoading: boolean;
}

export const initialPlanningState: PlanningState = planningAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0,
  selectedApplication: null,
  selectedLoading: false,
  conditions: [],
  conditionsLoading: false,
  appeals: [],
  appealsLoading: false
});
