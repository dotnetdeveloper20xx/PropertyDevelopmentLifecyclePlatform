import { createAction, props } from '@ngrx/store';
import { DesignPackageItem, CreateDesignPackageRequest } from '../../../core/models/design.model';

// Load Design Packages
export const loadDesignPackages = createAction(
  '[Design] Load Design Packages',
  props<{ projectId: string }>()
);
export const loadDesignPackagesSuccess = createAction(
  '[Design] Load Design Packages Success',
  props<{ packages: DesignPackageItem[] }>()
);
export const loadDesignPackagesFailure = createAction(
  '[Design] Load Design Packages Failure',
  props<{ error: string }>()
);

// Create Design Package
export const createDesignPackage = createAction(
  '[Design] Create Design Package',
  props<{ projectId: string; request: CreateDesignPackageRequest }>()
);
export const createDesignPackageSuccess = createAction(
  '[Design] Create Design Package Success',
  props<{ designPackage: DesignPackageItem }>()
);
export const createDesignPackageFailure = createAction(
  '[Design] Create Design Package Failure',
  props<{ error: string }>()
);
