import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { TenancyItem } from '../../../core/models/rental.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Tenancy Detail View — displays full information for a single tenancy record.
 * Fetches from the list endpoint and filters by ID (no dedicated getById endpoint yet).
 */
@Component({
  selector: 'app-tenancy-detail',
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
      { label: 'Rentals', url: '/rentals' },
      { label: item?.tenantName ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.tenantName ?? 'Tenancy Detail'"
      subtitle="View tenancy information, lease terms, and tenant contact details">
      <a routerLink="/rentals" class="btn btn-ghost btn-sm gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to List
      </a>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading tenancy details..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/rentals" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tenant Information -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Tenant Information</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Tenant Name</dt>
                <dd class="mt-0.5">{{ item.tenantName }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Email</dt>
                <dd class="mt-0.5">
                  @if (item.tenantEmail) {
                    <a [href]="'mailto:' + item.tenantEmail" class="link link-primary">{{ item.tenantEmail }}</a>
                  } @else { — }
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Phone</dt>
                <dd class="mt-0.5">
                  @if (item.tenantPhone) {
                    <a [href]="'tel:' + item.tenantPhone" class="link link-primary">{{ item.tenantPhone }}</a>
                  } @else { — }
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Lease Details -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Lease Details</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Unit</dt>
                <dd class="mt-0.5">{{ item.unitReference ?? item.unitId }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Monthly Rent</dt>
                <dd class="mt-0.5 font-semibold text-primary">
                  {{ item.rentAmount | currency:item.currency:'symbol':'1.0-0' }}
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Rent Frequency</dt>
                <dd class="mt-0.5">{{ item.rentFrequency }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Deposit</dt>
                <dd class="mt-0.5">
                  @if (item.depositAmount != null) {
                    {{ item.depositAmount | currency:item.currency:'symbol':'1.0-0' }}
                  } @else { — }
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Lease Start</dt>
                <dd class="mt-0.5">{{ item.startDate | date:'mediumDate' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Lease End</dt>
                <dd class="mt-0.5">{{ item.endDate ? (item.endDate | date:'mediumDate') : 'Rolling / Periodic' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Financial Summary</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Rent Amount</dt>
                <dd class="mt-0.5">{{ item.rentAmount | currency:item.currency:'symbol':'1.2-2' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Frequency</dt>
                <dd class="mt-0.5">{{ item.rentFrequency }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'mediumDate' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Notes -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Notes</h2>
            <div class="divider mt-0 mb-2"></div>
            <p class="text-sm whitespace-pre-wrap">{{ item.notes ?? 'No notes recorded.' }}</p>
          </div>
        </div>
      </div>
    }
  `
})
export class TenancyDetailComponent implements OnInit {
  item: TenancyItem | null = null;
  loading = true;
  error: string | null = null;

  private id = '';
  private readonly apiUrl = `${environment.apiUrl}/tenancies`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadTenancy();
  }

  private loadTenancy(): void {
    this.http.get<ApiResponse<TenancyItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(t => t.id === this.id) ?? null;
        if (!this.item) {
          this.error = `Tenancy with ID "${this.id}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load tenancy details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
