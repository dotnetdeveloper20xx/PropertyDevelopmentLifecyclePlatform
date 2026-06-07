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
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box.component';
import { TenancyItem, TenancyStatus, RentFrequency, CreateTenancyRequest } from '../../../core/models/rental.model';
import * as RentalsActions from '../store/rentals.actions';
import * as RentalsSelectors from '../store/rentals.selectors';

@Component({
  selector: 'app-tenancy-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent,
    ErrorStateComponent, SearchBoxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Rental Management'}, {label: 'Tenancies'}]"></app-breadcrumb>
    <app-page-header title="Rental Management" subtitle="Manage tenancies, track rent collection, and monitor lease terms">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Add Tenancy</button>
    </app-page-header>
    <app-page-description
      description="Rental Management tracks all active and historical tenancies across your portfolio. Each tenancy records tenant details, lease terms, rent amounts, and payment schedules for effective property management."
      guidance="Search by tenant name or filter by status to focus on specific tenancies. Click Add Tenancy to register a new lease agreement."
      helpLink="/help/rentals/rentals-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by tenant name..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Expired">Expired</option>
        <option value="Terminated">Terminated</option>
        <option value="Renewed">Renewed</option>
      </select>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Register New Tenancy</h3>
        <form [formGroup]="tenancyForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Tenant Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="tenantName"
              placeholder="e.g. Sarah Johnson" />
            @if (tenancyForm.get('tenantName')?.touched && tenancyForm.get('tenantName')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Tenant name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Unit ID *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="unitId"
              placeholder="Unit GUID" />
            @if (tenancyForm.get('unitId')?.touched && tenancyForm.get('unitId')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Unit ID is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Rent Amount *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="rentAmount"
              placeholder="e.g. 1500" min="0" step="0.01" />
            @if (tenancyForm.get('rentAmount')?.touched && tenancyForm.get('rentAmount')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Rent amount is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Rent Frequency *</span></label>
            <select class="select select-bordered select-sm" formControlName="rentFrequency">
              <option value="">Select frequency...</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annually">Annually</option>
            </select>
            @if (tenancyForm.get('rentFrequency')?.touched && tenancyForm.get('rentFrequency')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Rent frequency is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Start Date *</span></label>
            <input type="date" class="input input-bordered input-sm" formControlName="startDate" />
            @if (tenancyForm.get('startDate')?.touched && tenancyForm.get('startDate')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Start date is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">End Date</span></label>
            <input type="date" class="input input-bordered input-sm" formControlName="endDate" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Tenant Email</span></label>
            <input type="email" class="input input-bordered input-sm" formControlName="tenantEmail"
              placeholder="e.g. tenant@email.com" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Tenant Phone</span></label>
            <input type="tel" class="input input-bordered input-sm" formControlName="tenantPhone"
              placeholder="e.g. 07700 900000" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Deposit Amount</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="depositAmount"
              placeholder="e.g. 3000" min="0" step="0.01" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="tenancyForm.invalid">Register Tenancy</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading tenancies..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadTenancies()"></app-error-state>
    } @else if ((tenancies$ | async)?.length === 0) {
      @if (searchTerm || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Tenancies</h3>
          <p class="text-base-content/60 mt-2">No tenancies match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Tenancies Registered"
          message="Start managing your rental portfolio by registering tenancies. Track lease terms, rent collection, and tenant communications from one central place.">
          <button class="btn btn-primary btn-sm" (click)="toggleForm()">Register Your First Tenancy</button>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Tenancies">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Unit</th>
                <th>Rent</th>
                <th>Frequency</th>
                <th>Start</th>
                <th>End</th>
                <th>Deposit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (tenancy of tenancies$ | async; track tenancy.id) {
                <tr class="hover">
                  <td class="font-medium">
                    {{ tenancy.tenantName }}
                    @if (tenancy.tenantEmail) {
                      <div class="text-xs text-base-content/50">{{ tenancy.tenantEmail }}</div>
                    }
                  </td>
                  <td class="font-mono text-sm">{{ tenancy.unitReference ?? tenancy.unitId }}</td>
                  <td class="font-mono text-sm">{{ tenancy.currency }} {{ tenancy.rentAmount | number:'1.2-2' }}</td>
                  <td class="text-sm">{{ tenancy.rentFrequency }}</td>
                  <td class="text-xs text-base-content/50">{{ tenancy.startDate | date:'mediumDate' }}</td>
                  <td class="text-xs text-base-content/50">{{ tenancy.endDate ? (tenancy.endDate | date:'mediumDate') : '—' }}</td>
                  <td class="font-mono text-sm">
                    @if (tenancy.depositAmount) {
                      {{ tenancy.currency }} {{ tenancy.depositAmount | number:'1.2-2' }}
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td><app-status-badge [status]="tenancy.status"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-4">
        <p class="text-sm text-base-content/50">
          Page {{ currentPage }} of {{ totalPages() }} ({{ totalCount$ | async }} items)
        </p>
        <div class="join">
          <button class="join-item btn btn-sm" [disabled]="currentPage <= 1" (click)="goToPage(currentPage - 1)">«</button>
          @for (page of visiblePages(); track page) {
            <button class="join-item btn btn-sm" [class.btn-active]="page === currentPage" (click)="goToPage(page)">{{ page }}</button>
          }
          <button class="join-item btn btn-sm" [disabled]="currentPage >= totalPages()" (click)="goToPage(currentPage + 1)">»</button>
        </div>
        <select class="select select-bordered select-sm" [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange()" aria-label="Page size">
          <option [ngValue]="10">10 per page</option>
          <option [ngValue]="25">25 per page</option>
          <option [ngValue]="50">50 per page</option>
        </select>
      </div>
    }
  `
})
export class TenancyListComponent implements OnInit {
  tenancies$: Observable<TenancyItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: TenancyStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  showForm = false;
  private totalCountValue = 0;

  tenancyForm = new FormGroup({
    tenantName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    unitId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rentAmount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    rentFrequency: new FormControl<RentFrequency | ''>('', { nonNullable: true, validators: [Validators.required] }),
    startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endDate: new FormControl('', { nonNullable: true }),
    tenantEmail: new FormControl('', { nonNullable: true }),
    tenantPhone: new FormControl('', { nonNullable: true }),
    depositAmount: new FormControl<number | null>(null)
  });

  constructor(private store: Store) {
    this.tenancies$ = this.store.select(RentalsSelectors.selectAllTenancies);
    this.loading$ = this.store.select(RentalsSelectors.selectRentalsLoading);
    this.error$ = this.store.select(RentalsSelectors.selectRentalsError);
    this.totalCount$ = this.store.select(RentalsSelectors.selectRentalsTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadTenancies();
  }

  loadTenancies(): void {
    this.store.dispatch(RentalsActions.loadTenancies({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadTenancies();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTenancies();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadTenancies();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.tenancyForm.reset();
    }
  }

  onSubmit(): void {
    if (this.tenancyForm.invalid) return;

    const formValue = this.tenancyForm.getRawValue();
    const request: CreateTenancyRequest = {
      unitId: formValue.unitId,
      tenantName: formValue.tenantName,
      rentAmount: formValue.rentAmount ?? 0,
      rentFrequency: formValue.rentFrequency as RentFrequency,
      startDate: formValue.startDate,
      endDate: formValue.endDate || undefined,
      tenantEmail: formValue.tenantEmail || undefined,
      tenantPhone: formValue.tenantPhone || undefined,
      depositAmount: formValue.depositAmount ?? undefined
    };

    this.store.dispatch(RentalsActions.createTenancy({ request }));
    this.tenancyForm.reset();
    this.showForm = false;
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCountValue / this.pageSize));
  }

  visiblePages(): number[] {
    const total = this.totalPages();
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadTenancies();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadTenancies();
  }
}
