import { createAction, props } from '@ngrx/store';
import { TenancyItem, CreateTenancyRequest, TenancyStatus } from '../../../core/models/rental.model';

// Load Tenancies
export const loadTenancies = createAction(
  '[Rentals] Load Tenancies',
  props<{ page?: number; pageSize?: number; search?: string; status?: TenancyStatus }>()
);
export const loadTenanciesSuccess = createAction(
  '[Rentals] Load Tenancies Success',
  props<{ tenancies: TenancyItem[]; totalCount: number }>()
);
export const loadTenanciesFailure = createAction(
  '[Rentals] Load Tenancies Failure',
  props<{ error: string }>()
);

// Create Tenancy
export const createTenancy = createAction(
  '[Rentals] Create Tenancy',
  props<{ request: CreateTenancyRequest }>()
);
export const createTenancySuccess = createAction(
  '[Rentals] Create Tenancy Success',
  props<{ tenancy: TenancyItem }>()
);
export const createTenancyFailure = createAction(
  '[Rentals] Create Tenancy Failure',
  props<{ error: string }>()
);
