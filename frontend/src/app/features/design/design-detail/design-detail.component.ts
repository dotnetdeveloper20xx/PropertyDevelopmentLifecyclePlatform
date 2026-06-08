import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { DesignPackageItem } from '../../../core/models/design.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Design Package detail page.
 * Shows package metadata including discipline, consultant, version, and approval dates.
 */
@Component({
  selector: 'app-design-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent,
    StatusBadgeComponent, LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Design', url: '/design' },
      { label: item?.name ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.name ?? 'Design Package Detail'"
      subtitle="View design package information, discipline, and approval status">
      <div class="flex gap-2">
        <a routerLink="/design" class="btn btn-ghost btn-sm">← Back to List</a>
        @if (item) {
          <a [routerLink]="['/design', itemId, 'edit']" class="btn btn-primary btn-sm">Edit</a>
        }
      </div>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading design package..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/design" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Package Information -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Package Information</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">Name</dt>
                <dd class="mt-0.5">{{ item.name }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Version</dt>
                <dd class="mt-0.5">v{{ item.version }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Discipline</dt>
                <dd class="mt-0.5">{{ item.discipline ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Consultant</dt>
                <dd class="mt-0.5">{{ item.consultant ?? '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Timeline -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Timeline</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Submitted Date</dt>
                <dd class="mt-0.5">{{ item.submittedDate ? (item.submittedDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Approved Date</dt>
                <dd class="mt-0.5">{{ item.approvedDate ? (item.approvedDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'medium' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Description & Notes -->
        <div class="card bg-base-100 shadow-sm lg:col-span-2">
          <div class="card-body">
            <h2 class="card-title text-lg">Description & Notes</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Description</dt>
                <dd class="mt-0.5">{{ item.description ?? 'No description provided.' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Notes</dt>
                <dd class="mt-0.5">{{ item.notes ?? 'No notes recorded.' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    }
  `
})
export class DesignDetailComponent implements OnInit {
  item: DesignPackageItem | null = null;
  loading = true;
  error: string | null = null;
  itemId = '';

  private readonly apiUrl = `${environment.apiUrl}/design`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<DesignPackageItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(d => d.id === this.itemId) ?? null;
        if (!this.item) {
          this.error = `Design package with ID "${this.itemId}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load design package. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
