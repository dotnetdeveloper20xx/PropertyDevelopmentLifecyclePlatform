import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { KnowledgeDocumentService } from '../../../core/services/knowledge-document.service';
import { ToastService } from '../../../core/services/toast.service';
import * as DocumentsActions from './documents.actions';

/**
 * NgRx Effects for Documents & Knowledge module.
 * All API calls (side effects) live here — never in components.
 */
@Injectable()
export class DocumentsEffects {
  private actions$ = inject(Actions);
  private documentService = inject(KnowledgeDocumentService);
  private toastService = inject(ToastService);

  // Load Documents
  loadDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadDocuments),
      exhaustMap(({ page, pageSize, search, category }) =>
        this.documentService.getAll({ page, pageSize, search, category }).pipe(
          map((response) =>
            DocumentsActions.loadDocumentsSuccess({
              documents: response.data,
              totalCount: response.pagination?.totalCount ?? response.data.length
            })
          ),
          catchError((error) =>
            of(DocumentsActions.loadDocumentsFailure({
              error: error.error?.errors?.[0] ?? 'Failed to load documents'
            }))
          )
        )
      )
    )
  );

  // Create Document
  createDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.createDocument),
      exhaustMap(({ request }) =>
        this.documentService.create(request).pipe(
          map((response) =>
            DocumentsActions.createDocumentSuccess({ document: response.data })
          ),
          catchError((error) =>
            of(DocumentsActions.createDocumentFailure({
              error: error.error?.errors?.[0] ?? 'Failed to create document'
            }))
          )
        )
      )
    )
  );

  createDocumentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.createDocumentSuccess),
      tap(() => this.toastService.success('Document created successfully'))
    ), { dispatch: false }
  );

  // Failure toasts
  failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DocumentsActions.loadDocumentsFailure,
        DocumentsActions.createDocumentFailure
      ),
      tap(({ error }) => this.toastService.error(error))
    ), { dispatch: false }
  );
}
