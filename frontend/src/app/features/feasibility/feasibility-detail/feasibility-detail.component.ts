import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { FeasibilityItem } from '../../../core/models/feasibility.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Feasibility Assessment detail page.
 * Displays financial assumptions, calculated profit, and ROI for a development appraisal.
 */
@Component({
  selector: 'app-feasibility-detail',
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
      { label: 'Feasibility', url: '/feasibility' },
      { label: item?.title ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.title ?? 'Feasibility Detail'"
      subtitle="Development appraisal — cost assumptions, revenue projections, and viability analysis">
      <div class="flex gap-2">
        <a routerLink="/feasibility" class="btn btn-ghost btn-sm">← Back to List</a>
        @if (item) {
          <a [routerLink]="['/feasibility', itemId, 'edit']" class="btn btn-primary btn-sm">Edit</a>
        }
      </div>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading feasibility assessment..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/feasibility" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Assessment Overview -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Assessment Overview</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">Title</dt>
                <dd class="mt-0.5">{{ item.title }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Assessed By</dt>
                <dd class="mt-0.5">{{ item.assessedBy ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'medium' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Cost Breakdown -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Cost Breakdown</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Estimated Land Cost</dt>
                <dd class="mt-0.5">{{ item.estimatedLandCost | currency:'GBP':'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Estimated Build Cost</dt>
                <dd class="mt-0.5">{{ item.estimatedBuildCost | currency:'GBP':'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Professional Fees</dt>
                <dd class="mt-0.5">{{ item.professionalFees | currency:'GBP':'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Finance Costs</dt>
                <dd class="mt-0.5">{{ item.financeCosts | currency:'GBP':'symbol':'1.0-0' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Revenue & Returns -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Revenue & Returns</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Gross Development Value</dt>
                <dd class="mt-0.5">{{ item.grossDevelopmentValue | currency:'GBP':'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Expected Revenue</dt>
                <dd class="mt-0.5">{{ item.expectedRevenue | currency:'GBP':'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Estimated Profit</dt>
                <dd class="mt-0.5 font-semibold" [class.text-success]="item.estimatedProfit > 0" [class.text-error]="item.estimatedProfit < 0">
                  {{ item.estimatedProfit | currency:'GBP':'symbol':'1.0-0' }}
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">ROI</dt>
                <dd class="mt-0.5 font-semibold" [class.text-success]="item.roi > 0" [class.text-error]="item.roi < 0">
                  {{ item.roi | number:'1.1-1' }}%
                </dd>
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
export class FeasibilityDetailComponent implements OnInit {
  item: FeasibilityItem | null = null;
  loading = true;
  error: string | null = null;
  itemId = '';

  private readonly apiUrl = `${environment.apiUrl}/feasibility`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<FeasibilityItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(f => f.id === this.itemId) ?? null;
        if (!this.item) {
          this.error = `Feasibility assessment with ID "${this.itemId}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load feasibility assessment. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
