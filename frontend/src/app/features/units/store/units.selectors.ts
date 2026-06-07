import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnitsState } from './units.state';

const selectUnitsState = createFeatureSelector<UnitsState>('units');

export const selectUnits = createSelector(selectUnitsState, (state) => state.units);
export const selectUnitsLoading = createSelector(selectUnitsState, (state) => state.loading);
export const selectUnitsError = createSelector(selectUnitsState, (state) => state.error);
