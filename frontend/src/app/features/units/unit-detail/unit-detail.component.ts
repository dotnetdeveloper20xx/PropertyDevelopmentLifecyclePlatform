import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { UnitItem } from '../../../core/models/unit.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Unit detail page.
 * Displays property unit reference, type, specifications, pricing, and status.
 */
@Component({
  selector: 'app-unit-detail',
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
      { label: 'Units', url: '/units' },
      { label: item?.reference ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.reference ?? 'Unit Detail'"
      subtitle="View property unit specifications, pricing, and availability status">
      <div class="flex gap-2">
        <a routerLink="/units" class="btn btn-ghost btn-sm">← Back to List</a>
        @if (item) {
          <a [routerLink]="['/units', itemId, 'edit']" class="btn btn-primary btn-sm">Edit</a>
        }
      </div>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading unit details..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/units" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Unit Identity -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Unit Identity</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Reference</dt>
                <dd class="mt-0.5 font-mono">{{ item.reference }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Type</dt>
                <dd class="mt-0.5">{{ item.type }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Floor</dt>
                <dd class="mt-0.5">{{ item.floor !== null ? item.floor : '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Specifications -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Specifications</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Bedrooms</dt>
                <dd class="mt-0.5 text-lg font-semibold">{{ item.bedrooms }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Bathrooms</dt>
                <dd class="mt-0.5 text-lg font-semibold">{{ item.bathrooms }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Area (sq ft)</dt>
                <dd class="mt-0.5">{{ item.areaSqFt !== null ? (item.areaSqFt | number:'1.0-0') : '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Pricing -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Pricing</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Price</dt>
                <dd class="mt-0.5 text-xl font-semibold text-primary">{{ item.price | currency:item.currency:'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Created</dt>
                <dd class="mt-0.5">{{ item.createdAt | date:'medium' }}</dd>
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
export class UnitDetailComponent implements OnInit {
  item: UnitItem | null = null;
  loading = true;
  error: string | null = null;
  itemId = '';

  private readonly apiUrl = `${environment.apiUrl}/units`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<UnitItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(u => u.id === this.itemId) ?? null;
        if (!this.item) {
          this.error = `Unit with ID "${this.itemId}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load unit details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
