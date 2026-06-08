import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { DocumentItem, CreateDocumentRequest, DocumentCategory } from '../../../core/models/document.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as DocumentsActions from '../store/documents.actions';
import * as DocumentsSelectors from '../store/documents.selectors';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Documents'}, {label: 'Repository'}]"></app-breadcrumb>
    <app-page-header title="Documents & Knowledge" subtitle="Central document repository for all project files, templates, and compliance records">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Upload Document</button>
    </app-page-header>
    <app-page-description
      description="The Documents & Knowledge module provides a centralised repository for all project documentation including contracts, planning documents, legal files, financial records, and templates. Documents are versioned and categorised for easy retrieval."
      guidance="Use the search and category filter to find specific documents. Upload new documents using the form above."
      helpLink="/help/documents/documents-overview"
    ></app-page-description>

    <!-- Search & Filter Controls -->
    <div class="flex flex-wrap items-end gap-3 mb-4">
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">Search</span></div>
        <input type="text" class="input input-bordered input-sm"
          placeholder="Search by title or file name..."
          [(ngModel)]="searchTerm" (keyup.enter)="onSearch()" aria-label="Search documents" />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">Category</span></div>
        <select class="select select-bordered select-sm" [(ngModel)]="selectedCategory" (ngModelChange)="onSearch()" aria-label="Filter by category">
          <option value="">All Categories</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
      </label>
      <button class="btn btn-sm btn-outline" (click)="onSearch()">Search</button>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Upload New Document</h3>
        <form [formGroup]="documentForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Title *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="title"
              placeholder="e.g. Site Survey Report" />
            @if (documentForm.get('title')?.touched && documentForm.get('title')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Title is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Category *</span></label>
            <select class="select select-bordered select-sm" formControlName="category">
              <option value="">Select category</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
            @if (documentForm.get('category')?.touched && documentForm.get('category')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Category is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">File Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="fileName"
              placeholder="e.g. survey-report.pdf" />
            @if (documentForm.get('fileName')?.touched && documentForm.get('fileName')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">File name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">File Path *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="filePath"
              placeholder="e.g. /uploads/documents/survey.pdf" />
            @if (documentForm.get('filePath')?.touched && documentForm.get('filePath')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">File path is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">File Size (bytes) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="fileSizeBytes"
              placeholder="e.g. 102400" min="1" />
            @if (documentForm.get('fileSizeBytes')?.touched && documentForm.get('fileSizeBytes')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">File size is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Description</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="description"
              placeholder="Optional description" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Tags (comma-separated)</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="tags"
              placeholder="e.g. planning, phase-1" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Project ID</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="projectId"
              placeholder="Optional project link" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="documentForm.invalid">Upload Document</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading documents..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="onSearch()"></app-error-state>
    } @else if ((documents$ | async)?.length === 0) {
      <app-empty-state
        title="No Documents Found"
        message="Upload your first document to begin building your knowledge repository. Documents are categorised and versioned for easy retrieval across all projects.">
        <button class="btn btn-primary btn-sm" (click)="toggleForm()">Upload Your First Document</button>
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Documents repository">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>File Name</th>
                <th>Version</th>
                <th>Uploaded By</th>
                <th>Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of documents$ | async; track doc.id) {
                <tr class="hover">
                  <td class="font-medium">{{ doc.title }}</td>
                  <td><app-status-badge [status]="doc.category"></app-status-badge></td>
                  <td class="font-mono text-sm">{{ doc.fileName }}</td>
                  <td class="text-center">
                    <span class="badge badge-sm badge-outline">v{{ doc.version }}</span>
                  </td>
                  <td class="text-sm">{{ doc.uploadedBy ?? '—' }}</td>
                  <td class="text-xs text-base-content/50">{{ doc.uploadedAt | date:'medium' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        @if ((totalCount$ | async)! > pageSize) {
          <div class="flex items-center justify-between px-4 py-3 border-t border-base-300">
            <span class="text-sm text-base-content/60">
              Showing {{ ((currentPage - 1) * pageSize) + 1 }}–{{ currentPage * pageSize > (totalCount$ | async)! ? (totalCount$ | async) : currentPage * pageSize }}
              of {{ totalCount$ | async }} documents
            </span>
            <div class="join">
              <button class="join-item btn btn-sm" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">«</button>
              <button class="join-item btn btn-sm btn-active">{{ currentPage }}</button>
              <button class="join-item btn btn-sm" [disabled]="(currentPage * pageSize) >= (totalCount$ | async)!" (click)="changePage(currentPage + 1)">»</button>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class DocumentListComponent implements OnInit {
  documents$: Observable<DocumentItem[]>;
  loading$: Observable<boolean>;
  totalCount$: Observable<number>;
  error$: Observable<string | null>;

  searchTerm = '';
  selectedCategory = '';
  showForm = false;
  currentPage = 1;
  pageSize = 20;

  categories: DocumentCategory[] = [
    'Contract', 'Planning', 'Legal', 'Financial', 'Construction',
    'Sales', 'Compliance', 'Template', 'Report', 'Other'
  ];

  documentForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl<DocumentCategory | ''>('', { nonNullable: true, validators: [Validators.required] }),
    fileName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    filePath: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fileSizeBytes: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    description: new FormControl('', { nonNullable: true }),
    tags: new FormControl('', { nonNullable: true }),
    projectId: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.documents$ = this.store.select(DocumentsSelectors.selectDocuments);
    this.loading$ = this.store.select(DocumentsSelectors.selectDocumentsLoading);
    this.totalCount$ = this.store.select(DocumentsSelectors.selectDocumentsTotalCount);
    this.error$ = this.store.select(DocumentsSelectors.selectDocumentsError);
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.store.dispatch(DocumentsActions.loadDocuments({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      category: this.selectedCategory || undefined
    }));
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDocuments();
  }

  exportCsv(): void {
    this.documents$.subscribe(documents => {
      const headers = ['Title', 'Category', 'File Name', 'Version', 'Uploaded By', 'Uploaded At'];
      const rows = documents.map(d => [
        d.title,
        d.category,
        d.fileName,
        d.version.toString(),
        d.uploadedBy ?? '',
        d.uploadedAt ?? ''
      ]);
      exportToCsv('documents', headers, rows);
    }).unsubscribe();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadDocuments();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.documentForm.reset();
    }
  }

  onSubmit(): void {
    if (this.documentForm.invalid) return;

    const formValue = this.documentForm.getRawValue();
    const request: CreateDocumentRequest = {
      title: formValue.title,
      category: formValue.category as DocumentCategory,
      fileName: formValue.fileName,
      filePath: formValue.filePath,
      fileSizeBytes: formValue.fileSizeBytes ?? 0,
      description: formValue.description || undefined,
      tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
      projectId: formValue.projectId || undefined
    };

    this.store.dispatch(DocumentsActions.createDocument({ request }));
    this.documentForm.reset();
    this.showForm = false;
  }
}
