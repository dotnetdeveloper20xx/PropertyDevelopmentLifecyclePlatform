import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { DocumentItem } from '../../../core/models/document.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Document Detail View — displays full information for a single document.
 * Fetches from the list endpoint and filters by ID (no dedicated getById endpoint yet).
 */
@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    BreadcrumbComponent,
    StatusBadgeComponent,
    LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Documents', url: '/documents' },
      { label: item?.title ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.title ?? 'Document Detail'"
      subtitle="View document information, metadata, and file details">
      <a routerLink="/documents" class="btn btn-ghost btn-sm gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to List
      </a>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading document details..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/documents" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Document Information -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Document Information</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">Title</dt>
                <dd class="mt-0.5">{{ item.title }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Category</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.category"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Version</dt>
                <dd class="mt-0.5">v{{ item.version }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">Description</dt>
                <dd class="mt-0.5">{{ item.description ?? '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- File Details -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">File Details</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">File Name</dt>
                <dd class="mt-0.5">{{ item.fileName }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">File Size</dt>
                <dd class="mt-0.5">{{ formatFileSize(item.fileSizeBytes) }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">File Path</dt>
                <dd class="mt-0.5 break-all">{{ item.filePath }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Tags & Classification -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Tags & Classification</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Tags</dt>
                <dd class="mt-0.5">
                  @if (item.tags && item.tags.length > 0) {
                    <div class="flex flex-wrap gap-1">
                      @for (tag of item.tags; track tag) {
                        <span class="badge badge-outline badge-sm">{{ tag }}</span>
                      }
                    </div>
                  } @else {
                    —
                  }
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Project ID</dt>
                <dd class="mt-0.5">{{ item.projectId ?? '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Upload Information -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Upload Information</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Uploaded By</dt>
                <dd class="mt-0.5">{{ item.uploadedBy ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Uploaded At</dt>
                <dd class="mt-0.5">{{ item.uploadedAt | date:'medium' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created At</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'medium' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    }
  `
})
export class DocumentDetailComponent implements OnInit {
  item: DocumentItem | null = null;
  loading = true;
  error: string | null = null;

  private id = '';
  private readonly apiUrl = `${environment.apiUrl}/documents`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadDocument();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private loadDocument(): void {
    this.http.get<ApiResponse<DocumentItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(d => d.id === this.id) ?? null;
        if (!this.item) {
          this.error = `Document with ID "${this.id}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load document details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
