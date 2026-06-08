import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { PurchaseOrderItem, CreatePurchaseOrderRequest } from '../../../core/models/procurement.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as ProcurementActions from '../store/procurement.actions';
import * as ProcurementSelectors from '../store/procurement.selectors';

@Component({
  selector: 'app-procurement-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Procurement'}, {label: 'Orders'}]"></app-breadcrumb>
    <app-page-header title="Purchase Orders" subtitle="Track procurement activities across your projects">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Create Order</button>
    </app-page-header>
    <app-page-description
      description="Procurement manages purchase orders for materials, equipment, and services required by your development projects. Each order progresses through a lifecycle: Draft → Submitted → Approved → Ordered → Delivered."
      guidance="Enter a Project ID below to load orders for a specific project. Use the inline form to create new purchase orders."
      helpLink="/help/procurement/procurement-overview"
    ></app-page-description>

    <!-- Project Selector -->
    <div class="flex items-center gap-3 mb-4">
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">Project ID</span></div>
        <div class="flex gap-2">
          <input type="text" class="input input-bordered input-sm flex-1"
            placeholder="Enter project ID to load orders"
            [(ngModel)]="projectId" (keyup.enter)="loadOrders()" aria-label="Project ID" />
          <button class="btn btn-sm btn-outline" [disabled]="!projectId" (click)="loadOrders()">Load</button>
        </div>
      </label>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">New Purchase Order</h3>
        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Order Reference *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="orderReference"
              placeholder="e.g. PO-2024-001" />
            @if (orderForm.get('orderReference')?.touched && orderForm.get('orderReference')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Order reference is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Supplier Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="supplierName"
              placeholder="e.g. ABC Building Supplies" />
            @if (orderForm.get('supplierName')?.touched && orderForm.get('supplierName')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Supplier name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Total Value *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="totalValue"
              placeholder="e.g. 15000" min="0" step="0.01" />
            @if (orderForm.get('totalValue')?.touched && orderForm.get('totalValue')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Total value is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Expected Delivery</span></label>
            <input type="date" class="input input-bordered input-sm" formControlName="expectedDeliveryDate" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="orderForm.invalid || !projectId">Create Order</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading purchase orders..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadOrders()"></app-error-state>
    } @else if (!projectId) {
      <app-empty-state
        title="Select a Project"
        message="Enter a project ID above and click Load to view purchase orders for that project.">
      </app-empty-state>
    } @else if ((orders$ | async)?.length === 0) {
      <app-empty-state
        title="No Purchase Orders Yet"
        message="Create your first purchase order to begin tracking procurement for this project. Purchase orders help you manage supplier relationships, material costs, and delivery schedules.">
        <button class="btn btn-primary btn-sm" (click)="toggleForm()">Create Your First Order</button>
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Purchase orders">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Value</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Deliveries</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders$ | async; track order.id) {
                <tr class="hover">
                  <td class="font-medium font-mono text-sm">{{ order.orderReference }}</td>
                  <td>{{ order.supplierName }}</td>
                  <td><app-status-badge [status]="order.status"></app-status-badge></td>
                  <td class="font-mono text-sm">{{ order.currency }} {{ order.totalValue | number:'1.2-2' }}</td>
                  <td class="text-xs text-base-content/50">{{ order.orderDate | date:'mediumDate' }}</td>
                  <td class="text-xs text-base-content/50">{{ order.expectedDeliveryDate ? (order.expectedDeliveryDate | date:'mediumDate') : '—' }}</td>
                  <td>
                    @if (order.deliveryCount > 0) {
                      <span class="badge badge-sm badge-outline">{{ order.deliveryCount }}</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class ProcurementListComponent implements OnInit {
  orders$: Observable<PurchaseOrderItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  projectId = '';
  showForm = false;

  orderForm = new FormGroup({
    orderReference: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    supplierName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    totalValue: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    expectedDeliveryDate: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.orders$ = this.store.select(ProcurementSelectors.selectOrders);
    this.loading$ = this.store.select(ProcurementSelectors.selectOrdersLoading);
    this.error$ = this.store.select(ProcurementSelectors.selectProcurementError);
  }

  ngOnInit(): void {}

  loadOrders(): void {
    if (!this.projectId) return;
    this.store.dispatch(ProcurementActions.loadOrders({ projectId: this.projectId }));
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.orderForm.reset();
    }
  }

  exportCsv(): void {
    this.orders$.subscribe(orders => {
      const headers = ['Reference', 'Supplier', 'Status', 'Currency', 'Total Value', 'Order Date', 'Expected Delivery', 'Deliveries'];
      const rows = orders.map(o => [
        o.orderReference,
        o.supplierName,
        o.status,
        o.currency,
        o.totalValue.toString(),
        o.orderDate ?? '',
        o.expectedDeliveryDate ?? '',
        o.deliveryCount.toString()
      ]);
      exportToCsv('purchase-orders', headers, rows);
    }).unsubscribe();
  }

  onSubmit(): void {
    if (this.orderForm.invalid || !this.projectId) return;

    const formValue = this.orderForm.getRawValue();
    const request: CreatePurchaseOrderRequest = {
      projectId: this.projectId,
      orderReference: formValue.orderReference,
      supplierName: formValue.supplierName,
      totalValue: formValue.totalValue ?? 0,
      expectedDeliveryDate: formValue.expectedDeliveryDate || undefined
    };

    this.store.dispatch(ProcurementActions.createOrder({ projectId: this.projectId, request }));
    this.orderForm.reset();
    this.showForm = false;
  }
}
