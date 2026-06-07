import { UnitItem } from '../../../core/models/unit.model';

export interface UnitsState {
  units: UnitItem[];
  loading: boolean;
  error: string | null;
}

export const initialUnitsState: UnitsState = {
  units: [],
  loading: false,
  error: null
};
