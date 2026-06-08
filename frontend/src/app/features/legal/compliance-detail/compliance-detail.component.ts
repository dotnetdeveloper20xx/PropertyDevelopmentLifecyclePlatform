import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ComplianceCheckItem } from '../../../core/models/legal.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Compliance Check detail page.
 * Displays check type, status, risk level, outcome, and timeline information.
 */
@Component({
  selector: 'app-compliance-detail',
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
      { label: 'Legal', url: '/legal' },
      { label: 'Compliance', url: '/legal/compliance' },
      { label: 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item ? item.checkType + ' Check' : 'Compliance Detail'"
      subtitle="View compliance check details, outcome, and risk assessment">
      <a routerLink="/legal/compliance" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading compliance check..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/legal/compliance" class="btn btn-sm btn-ghost">Return to List</a>
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
                <dt class="text-base-content/60 font-medium">Check Type</dt>
                <dd class="mt-0.5">{{ item.checkType }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Assigned To</dt>
                <dd class="mt-0.5">{{ item.assignedTo ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Risk Level</dt>
                <dd class="mt-0.5">
                  @if (item.riskLevel) {
                    <app-status-badge [status]="item.riskLevel"></app-status-badge>
                  } @else {
                    —
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Timeline & Outcome -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Timeline & Outcome</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Due Date</dt>
                <dd class="mt-0.5">{{ item.dueDate ? (item.dueDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Completed Date</dt>
                <dd class="mt-0.5">{{ item.completedDate ? (item.completedDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">Outcome</dt>
                <dd class="mt-0.5">{{ item.outcome ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'medium' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Notes -->
        <div class="card bg-base-100 shadow-sm lg:col-span-2">
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
export class ComplianceDetailComponent implements OnInit {
  item: ComplianceCheckItem | null = null;
  loading = true;
  error: string | null = null;

  private itemId = '';
  private readonly apiUrl = `${environment.apiUrl}/legal/compliance`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<ComplianceCheckItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(c => c.id === this.itemId) ?? null;
        if (!this.item) {
          this.error = `Compliance check with ID "${this.itemId}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load compliance check. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
