import { createReducer, on } from '@ngrx/store';
import { initialUnitsState } from './units.state';
import * as UnitsActions from './units.actions';

export const unitsReducer = createReducer(
  initialUnitsState,

  // Load Units
  on(UnitsActions.loadUnits, (state) => ({
    ...state, loading: true, error: null
  })),
  on(UnitsActions.loadUnitsSuccess, (state, { units }) => ({
    ...state, units, loading: false
  })),
  on(UnitsActions.loadUnitsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Unit
  on(UnitsActions.createUnit, (state) => ({
    ...state, loading: true, error: null
  })),
  on(UnitsActions.createUnitSuccess, (state, { unit }) => ({
    ...state, units: [unit, ...state.units], loading: false
  })),
  on(UnitsActions.createUnitFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
