import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DesignState } from './design.state';

const selectDesignState = createFeatureSelector<DesignState>('design');

export const selectDesignPackages = createSelector(selectDesignState, (s) => s.packages);
export const selectDesignLoading = createSelector(selectDesignState, (s) => s.loading);
export const selectDesignError = createSelector(selectDesignState, (s) => s.error);
