import { createAction, props } from '@ngrx/store';
import { UnitItem, CreateUnitRequest } from '../../../core/models/unit.model';

// Load Units
export const loadUnits = createAction(
  '[Units] Load Units',
  props<{ projectId: string }>()
);
export const loadUnitsSuccess = createAction(
  '[Units] Load Units Success',
  props<{ units: UnitItem[] }>()
);
export const loadUnitsFailure = createAction(
  '[Units] Load Units Failure',
  props<{ error: string }>()
);

// Create Unit
export const createUnit = createAction(
  '[Units] Create Unit',
  props<{ projectId: string; request: CreateUnitRequest }>()
);
export const createUnitSuccess = createAction(
  '[Units] Create Unit Success',
  props<{ unit: UnitItem }>()
);
export const createUnitFailure = createAction(
  '[Units] Create Unit Failure',
  props<{ error: string }>()
);
