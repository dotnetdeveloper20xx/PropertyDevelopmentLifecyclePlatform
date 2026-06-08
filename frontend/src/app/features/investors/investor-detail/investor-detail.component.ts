import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { InvestorItem } from '../../../core/models/investor.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Investor Detail View — displays full information for a single investor.
 * Fetches from the list endpoint and filters by ID (no dedicated getById endpoint yet).
 */
@Component({
  selector: 'app-investor-detail',
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
      { label: 'Investors', url: '/investors' },
      { label: item?.name ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.name ?? 'Investor Detail'"
      subtitle="View investor profile, investment summary, and contact information">
      <a routerLink="/investors" class="btn btn-ghost btn-sm gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to List
      </a>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading investor details..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/investors" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Investor Profile -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Investor Profile</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Name</dt>
                <dd class="mt-0.5">{{ item.name }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Type</dt>
                <dd class="mt-0.5">{{ formatType(item.type) }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Company</dt>
                <dd class="mt-0.5">{{ item.company ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'mediumDate' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Contact Details -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Contact Details</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Email</dt>
                <dd class="mt-0.5">
                  @if (item.email) {
                    <a [href]="'mailto:' + item.email" class="link link-primary">{{ item.email }}</a>
                  } @else { — }
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Phone</dt>
                <dd class="mt-0.5">
                  @if (item.phone) {
                    <a [href]="'tel:' + item.phone" class="link link-primary">{{ item.phone }}</a>
                  } @else { — }
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Investment Summary -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Investment Summary</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Total Invested</dt>
                <dd class="mt-0.5 font-semibold text-primary">
                  {{ item.totalInvested | currency:item.currency:'symbol':'1.0-0' }}
                </dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Projects</dt>
                <dd class="mt-0.5">{{ item.projectCount }}</dd>
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
export class InvestorDetailComponent implements OnInit {
  item: InvestorItem | null = null;
  loading = true;
  error: string | null = null;

  private id = '';
  private readonly apiUrl = `${environment.apiUrl}/investors`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadInvestor();
  }

  formatType(type: string): string {
    return type.replace(/([A-Z])/g, ' $1').trim();
  }

  private loadInvestor(): void {
    this.http.get<ApiResponse<InvestorItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(i => i.id === this.id) ?? null;
        if (!this.item) {
          this.error = `Investor with ID "${this.id}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load investor details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
