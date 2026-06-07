import { ConstructionStageItem, InspectionItem, SnagItem } from '../../../core/models/construction.model';

export interface ConstructionState {
  stages: ConstructionStageItem[];
  stagesLoading: boolean;
  inspections: InspectionItem[];
  inspectionsLoading: boolean;
  snags: SnagItem[];
  snagsLoading: boolean;
  error: string | null;
}

export const initialConstructionState: ConstructionState = {
  stages: [],
  stagesLoading: false,
  inspections: [],
  inspectionsLoading: false,
  snags: [],
  snagsLoading: false,
  error: null
};
