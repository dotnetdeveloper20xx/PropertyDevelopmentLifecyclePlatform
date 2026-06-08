import { DocumentItem } from '../../../core/models/document.model';

export interface DocumentsState {
  documents: DocumentItem[];
  loading: boolean;
  totalCount: number;
  error: string | null;
}

export const initialDocumentsState: DocumentsState = {
  documents: [],
  loading: false,
  totalCount: 0,
  error: null
};
