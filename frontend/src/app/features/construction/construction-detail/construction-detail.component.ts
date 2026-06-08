import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ConstructionStageItem } from '../../../core/models/construction.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Construction Stage detail page.
 * Displays stage progress, planned/actual dates, inspection and snag counts.
 */
@Component({
  selector: 'app-construction-detail',
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
      { label: 'Construction', url: '/construction' },
      { label: item?.name ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.name ?? 'Construction Stage Detail'"
      subtitle="View construction stage progress, timeline, and quality metrics">
      <a routerLink="/construction" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading construction stage..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/construction" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Stage Overview -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Stage Overview</h2>
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
                <dt class="text-base-content/60 font-medium">Progress</dt>
                <dd class="mt-0.5">
                  @if (item.progressPercent !== null) {
                    <div class="flex items-center gap-2">
                      <progress class="progress progress-primary w-20" [value]="item.progressPercent" max="100"></progress>
                      <span>{{ item.progressPercent }}%</span>
                    </div>
                  } @else {
                    —
                  }
                </dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">Description</dt>
                <dd class="mt-0.5">{{ item.description ?? '—' }}</dd>
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
                <dt class="text-base-content/60 font-medium">Planned Start</dt>
                <dd class="mt-0.5">{{ item.plannedStartDate ? (item.plannedStartDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Planned End</dt>
                <dd class="mt-0.5">{{ item.plannedEndDate ? (item.plannedEndDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Actual Start</dt>
                <dd class="mt-0.5">{{ item.actualStartDate ? (item.actualStartDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Actual End</dt>
                <dd class="mt-0.5">{{ item.actualEndDate ? (item.actualEndDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'medium' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Quality Metrics -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Quality Metrics</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Inspections</dt>
                <dd class="mt-0.5 text-lg font-semibold">{{ item.inspectionCount }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Snags</dt>
                <dd class="mt-0.5 text-lg font-semibold" [class.text-warning]="item.snagCount > 0">{{ item.snagCount }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Notes -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Notes</h2>
            <div class="divider mt-0 mb-2"></div>
            <p class="text-sm">{{ item.notes ?? 'No notes recorded.' }}</p>
          </div>
        </div>
      </div>
    }
  `
})
export class ConstructionDetailComponent implements OnInit {
  item: ConstructionStageItem | null = null;
  loading = true;
  error: string | null = null;

  private itemId = '';
  private readonly apiUrl = `${environment.apiUrl}/construction`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<ConstructionStageItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(s => s.id === this.itemId) ?? null;
        if (!this.item) {
          this.error = `Construction stage with ID "${this.itemId}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load construction stage. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
