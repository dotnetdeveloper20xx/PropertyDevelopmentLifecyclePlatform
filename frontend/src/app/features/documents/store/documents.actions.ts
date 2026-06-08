import { createAction, props } from '@ngrx/store';
import { DocumentItem, CreateDocumentRequest } from '../../../core/models/document.model';

// Load Documents
export const loadDocuments = createAction(
  '[Documents] Load Documents',
  props<{ page?: number; pageSize?: number; search?: string; category?: string }>()
);
export const loadDocumentsSuccess = createAction(
  '[Documents] Load Documents Success',
  props<{ documents: DocumentItem[]; totalCount: number }>()
);
export const loadDocumentsFailure = createAction(
  '[Documents] Load Documents Failure',
  props<{ error: string }>()
);

// Create Document
export const createDocument = createAction(
  '[Documents] Create Document',
  props<{ request: CreateDocumentRequest }>()
);
export const createDocumentSuccess = createAction(
  '[Documents] Create Document Success',
  props<{ document: DocumentItem }>()
);
export const createDocumentFailure = createAction(
  '[Documents] Create Document Failure',
  props<{ error: string }>()
);
