import { createReducer, on } from '@ngrx/store';
import { initialConstructionState } from './construction.state';
import * as A from './construction.actions';

export const constructionReducer = createReducer(
  initialConstructionState,
  on(A.loadStages, (s) => ({ ...s, stagesLoading: true, error: null })),
  on(A.loadStagesSuccess, (s, { stages }) => ({ ...s, stages, stagesLoading: false })),
  on(A.loadStagesFailure, (s, { error }) => ({ ...s, stagesLoading: false, error })),
  on(A.createStageSuccess, (s, { stage }) => ({ ...s, stages: [...s.stages, stage] })),

  on(A.loadInspections, (s) => ({ ...s, inspectionsLoading: true })),
  on(A.loadInspectionsSuccess, (s, { inspections }) => ({ ...s, inspections, inspectionsLoading: false })),
  on(A.loadInspectionsFailure, (s) => ({ ...s, inspectionsLoading: false })),
  on(A.createInspectionSuccess, (s, { inspection }) => ({ ...s, inspections: [inspection, ...s.inspections] })),

  on(A.loadSnags, (s) => ({ ...s, snagsLoading: true })),
  on(A.loadSnagsSuccess, (s, { snags }) => ({ ...s, snags, snagsLoading: false })),
  on(A.loadSnagsFailure, (s) => ({ ...s, snagsLoading: false })),
  on(A.createSnagSuccess, (s, { snag }) => ({ ...s, snags: [snag, ...s.snags] }))
);
