import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentsState } from './documents.state';

const selectDocumentsState = createFeatureSelector<DocumentsState>('documents');

export const selectDocuments = createSelector(selectDocumentsState, (state) => state.documents);
export const selectDocumentsLoading = createSelector(selectDocumentsState, (state) => state.loading);
export const selectDocumentsTotalCount = createSelector(selectDocumentsState, (state) => state.totalCount);
export const selectDocumentsError = createSelector(selectDocumentsState, (state) => state.error);
