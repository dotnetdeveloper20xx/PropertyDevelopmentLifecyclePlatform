import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PurchaseOrderItem } from '../../../core/models/procurement.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Procurement (Purchase Order) detail page.
 * Displays order reference, supplier, value, delivery tracking, and status.
 */
@Component({
  selector: 'app-procurement-detail',
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
      { label: 'Procurement', url: '/procurement' },
      { label: item?.orderReference ?? 'Detail' }
    ]"></app-breadcrumb>

    <app-page-header
      [title]="item?.orderReference ?? 'Purchase Order Detail'"
      subtitle="View purchase order details, supplier information, and delivery tracking">
      <a routerLink="/procurement" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    @if (loading) {
      <app-loading-state message="Loading purchase order..."></app-loading-state>
    } @else if (error) {
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <a routerLink="/procurement" class="btn btn-sm btn-ghost">Return to List</a>
      </div>
    } @else if (item) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Order Information -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Order Information</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Order Reference</dt>
                <dd class="mt-0.5 font-mono">{{ item.orderReference }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Status</dt>
                <dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Total Value</dt>
                <dd class="mt-0.5 font-semibold">{{ item.totalValue | currency:item.currency:'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Order Date</dt>
                <dd class="mt-0.5">{{ item.orderDate | date:'mediumDate' }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-base-content/60 font-medium">Description</dt>
                <dd class="mt-0.5">{{ item.description ?? '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Supplier Details -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Supplier Details</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Supplier Name</dt>
                <dd class="mt-0.5">{{ item.supplierName }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Deliveries</dt>
                <dd class="mt-0.5 text-lg font-semibold">{{ item.deliveryCount }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Delivery Tracking -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-lg">Delivery Tracking</h2>
            <div class="divider mt-0 mb-2"></div>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-base-content/60 font-medium">Expected Delivery</dt>
                <dd class="mt-0.5">{{ item.expectedDeliveryDate ? (item.expectedDeliveryDate | date:'mediumDate') : '—' }}</dd>
              </div>
              <div>
                <dt class="text-base-content/60 font-medium">Actual Delivery</dt>
                <dd class="mt-0.5">{{ item.actualDeliveryDate ? (item.actualDeliveryDate | date:'mediumDate') : '—' }}</dd>
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
export class ProcurementDetailComponent implements OnInit {
  item: PurchaseOrderItem | null = null;
  loading = true;
  error: string | null = null;

  private itemId = '';
  private readonly apiUrl = `${environment.apiUrl}/procurement`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<PurchaseOrderItem[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.item = response.data.find(p => p.id === this.itemId) ?? null;
        if (!this.item) {
          this.error = `Purchase order with ID "${this.itemId}" not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load purchase order. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
