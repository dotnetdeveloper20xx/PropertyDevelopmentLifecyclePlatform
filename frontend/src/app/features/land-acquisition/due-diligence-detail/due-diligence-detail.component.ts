import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ApiResponse } from '../../../core/models/api-response.model';

interface DueDiligenceItem {
  id: string;
  type: string;
  status: string;
  findings: string | null;
  reportDate: string | null;
  notes: string | null;
  createdAt: string;
}

/**
 * Due Diligence detail page.
 * Displays check type, status, findings, and report date for a due diligence record.
 */
@Component({
  selector: 'app-due-diligence-detail',
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
      { label: 'Due Diligence', url: '/due-diligence' },
      { label: 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item ? item.type + ' Check' : 'Due Diligence Detail'"
      subtitle="View due diligence check details, findings, and status">
      <a routerLink="/due-diligence" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading due diligence details..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/due-diligence" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Check Information -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Check Information</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Type</dt>
                <dd class="mt-0.5">{{ item.type }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Report Date</dt>
                <dd class="mt-0.5">{{ item.reportDate ? (item.reportDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'medium' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Findings & Notes -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Findings & Notes</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Findings</dt>
                <dd class="mt-0.5">{{ item.findings ?? 'No findings recorded.' }}</dd>
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
export class DueDiligenceDetailComponent implements OnInit {
  item: DueDiligenceItem | null = null;
  loading = true;
  error: string | null = null;

  private itemId = '';
  private readonly apiUrl = `${environment.apiUrl}/due-diligence`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<DueDiligenceItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(d => d.id === this.itemId) ?? null;
        if (!this.item) {
          this.error = `Due diligence check with ID "${this.itemId}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load due diligence details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
