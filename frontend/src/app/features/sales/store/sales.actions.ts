import { createAction, props } from '@ngrx/store';
import { SalesLeadItem, CreateSalesLeadRequest, LeadStatus } from '../../../core/models/sales.model';

// Load Sales Leads
export const loadSalesLeads = createAction(
  '[Sales] Load Sales Leads',
  props<{ page?: number; pageSize?: number; search?: string; status?: LeadStatus }>()
);
export const loadSalesLeadsSuccess = createAction(
  '[Sales] Load Sales Leads Success',
  props<{ leads: SalesLeadItem[]; totalCount: number }>()
);
export const loadSalesLeadsFailure = createAction(
  '[Sales] Load Sales Leads Failure',
  props<{ error: string }>()
);

// Create Sales Lead
export const createSalesLead = createAction(
  '[Sales] Create Sales Lead',
  props<{ request: CreateSalesLeadRequest }>()
);
export const createSalesLeadSuccess = createAction(
  '[Sales] Create Sales Lead Success',
  props<{ lead: SalesLeadItem }>()
);
export const createSalesLeadFailure = createAction(
  '[Sales] Create Sales Lead Failure',
  props<{ error: string }>()
);
