import { createReducer, on } from '@ngrx/store';
import { initialDocumentsState } from './documents.state';
import * as DocumentsActions from './documents.actions';

export const documentsReducer = createReducer(
  initialDocumentsState,

  // Load Documents
  on(DocumentsActions.loadDocuments, (state) => ({
    ...state, loading: true, error: null
  })),
  on(DocumentsActions.loadDocumentsSuccess, (state, { documents, totalCount }) => ({
    ...state, documents, totalCount, loading: false
  })),
  on(DocumentsActions.loadDocumentsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create Document
  on(DocumentsActions.createDocument, (state) => ({
    ...state, loading: true, error: null
  })),
  on(DocumentsActions.createDocumentSuccess, (state, { document }) => ({
    ...state, documents: [document, ...state.documents], totalCount: state.totalCount + 1, loading: false
  })),
  on(DocumentsActions.createDocumentFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
