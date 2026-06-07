import { createAction, props } from '@ngrx/store';
import { ConstructionStageItem, CreateStageRequest, InspectionItem, CreateInspectionRequest, SnagItem, CreateSnagRequest } from '../../../core/models/construction.model';

export const loadStages = createAction('[Construction] Load Stages', props<{ projectId: string }>());
export const loadStagesSuccess = createAction('[Construction] Load Stages Success', props<{ stages: ConstructionStageItem[] }>());
export const loadStagesFailure = createAction('[Construction] Load Stages Failure', props<{ error: string }>());

export const createStage = createAction('[Construction] Create Stage', props<{ projectId: string; request: CreateStageRequest }>());
export const createStageSuccess = createAction('[Construction] Create Stage Success', props<{ stage: ConstructionStageItem }>());
export const createStageFailure = createAction('[Construction] Create Stage Failure', props<{ error: string }>());

export const loadInspections = createAction('[Construction] Load Inspections', props<{ stageId: string }>());
export const loadInspectionsSuccess = createAction('[Construction] Load Inspections Success', props<{ inspections: InspectionItem[] }>());
export const loadInspectionsFailure = createAction('[Construction] Load Inspections Failure', props<{ error: string }>());

export const createInspection = createAction('[Construction] Create Inspection', props<{ stageId: string; request: CreateInspectionRequest }>());
export const createInspectionSuccess = createAction('[Construction] Create Inspection Success', props<{ inspection: InspectionItem }>());
export const createInspectionFailure = createAction('[Construction] Create Inspection Failure', props<{ error: string }>());

export const loadSnags = createAction('[Construction] Load Snags', props<{ stageId: string }>());
export const loadSnagsSuccess = createAction('[Construction] Load Snags Success', props<{ snags: SnagItem[] }>());
export const loadSnagsFailure = createAction('[Construction] Load Snags Failure', props<{ error: string }>());

export const createSnag = createAction('[Construction] Create Snag', props<{ stageId: string; request: CreateSnagRequest }>());
export const createSnagSuccess = createAction('[Construction] Create Snag Success', props<{ snag: SnagItem }>());
export const createSnagFailure = createAction('[Construction] Create Snag Failure', props<{ error: string }>());
