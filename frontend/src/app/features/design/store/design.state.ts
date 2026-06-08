import { DesignPackageItem } from '../../../core/models/design.model';

export interface DesignState {
  packages: DesignPackageItem[];
  loading: boolean;
  error: string | null;
}

export const initialDesignState: DesignState = {
  packages: [],
  loading: false,
  error: null
};
