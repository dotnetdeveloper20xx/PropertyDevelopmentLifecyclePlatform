import { createReducer, on } from '@ngrx/store';
import { initialDesignState } from './design.state';
import * as DesignActions from './design.actions';

export const designReducer = createReducer(
  initialDesignState,

  // Load Design Packages
  on(DesignActions.loadDesignPackages, (state) => ({
    ...state, loading: true, error: null
  })),
  on(DesignActions.loadDesignPackagesSuccess, (state, { packages }) => ({
    ...state, packages, loading: false
  })),
  on(DesignActions.loadDesignPackagesFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Design Package
  on(DesignActions.createDesignPackage, (state) => ({
    ...state, loading: true, error: null
  })),
  on(DesignActions.createDesignPackageSuccess, (state, { designPackage }) => ({
    ...state, packages: [...state.packages, designPackage], loading: false
  })),
  on(DesignActions.createDesignPackageFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
