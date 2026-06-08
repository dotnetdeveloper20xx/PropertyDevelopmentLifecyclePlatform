import { FeasibilityItem } from '../../../core/models/feasibility.model';

export interface FeasibilityState {
  assessments: FeasibilityItem[];
  loading: boolean;
  error: string | null;
}

export const initialFeasibilityState: FeasibilityState = {
  assessments: [],
  loading: false,
  error: null
};
