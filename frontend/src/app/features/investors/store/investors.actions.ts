import { createAction, props } from '@ngrx/store';
import { InvestorItem, CreateInvestorRequest, InvestorType, InvestorStatus } from '../../../core/models/investor.model';

// Load Investors
export const loadInvestors = createAction(
  '[Investors] Load Investors',
  props<{ page?: number; pageSize?: number; search?: string; type?: InvestorType; status?: InvestorStatus }>()
);
export const loadInvestorsSuccess = createAction(
  '[Investors] Load Investors Success',
  props<{ investors: InvestorItem[]; totalCount: number }>()
);
export const loadInvestorsFailure = createAction(
  '[Investors] Load Investors Failure',
  props<{ error: string }>()
);

// Create Investor
export const createInvestor = createAction(
  '[Investors] Create Investor',
  props<{ request: CreateInvestorRequest }>()
);
export const createInvestorSuccess = createAction(
  '[Investors] Create Investor Success',
  props<{ investor: InvestorItem }>()
);
export const createInvestorFailure = createAction(
  '[Investors] Create Investor Failure',
  props<{ error: string }>()
);
