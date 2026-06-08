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
import { ActivityFeedComponent } from '../../../shared/components/activity-feed/activity-feed.component';
import { ContractorItem, ContractorType, ContractorStatus, CreateContractorRequest } from '../../../core/models/contractor.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as ContractorsActions from '../store/contractors.actions';
import * as ContractorsSelectors from '../store/contractors.selectors';

@Component({
  selector: 'app-contractor-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent,
    ErrorStateComponent, SearchBoxComponent, ActivityFeedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Contractors & Suppliers'}, {label: 'Directory'}]"></app-breadcrumb>
    <app-page-header title="Contractors & Suppliers" subtitle="Manage your contractor database, track performance, and maintain compliance">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Add Contractor</button>
    </app-page-header>
    <app-page-description
      description="The contractor directory is your central register of all companies you work with — main contractors, subcontractors, consultants, suppliers, and specialists. Maintain contact details, insurance records, certifications, and performance ratings."
      guidance="Search by company name or trade. Filter by type or status to find specific contractors. Click Add Contractor to register a new company."
      helpLink="/help/contractors/contractor-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by company name or trade..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="typeFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by type">
        <option value="">All Types</option>
        <option value="MainContractor">Main Contractor</option>
        <option value="Subcontractor">Subcontractor</option>
        <option value="Consultant">Consultant</option>
        <option value="Supplier">Supplier</option>
        <option value="Specialist">Specialist</option>
      </select>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Preferred">Preferred</option>
        <option value="OnHold">On Hold</option>
        <option value="Blacklisted">Blacklisted</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Register New Contractor</h3>
        <form [formGroup]="contractorForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Company Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="companyName"
              placeholder="e.g. Smith Construction Ltd" />
            @if (contractorForm.get('companyName')?.touched && contractorForm.get('companyName')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Company name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Type *</span></label>
            <select class="select select-bordered select-sm" formControlName="type">
              <option value="">Select type...</option>
              <option value="MainContractor">Main Contractor</option>
              <option value="Subcontractor">Subcontractor</option>
              <option value="Consultant">Consultant</option>
              <option value="Supplier">Supplier</option>
              <option value="Specialist">Specialist</option>
            </select>
            @if (contractorForm.get('type')?.touched && contractorForm.get('type')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Type is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Trade</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="trade"
              placeholder="e.g. Electrical, Plumbing, Roofing" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Contact Name</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="contactName"
              placeholder="e.g. John Smith" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Email</span></label>
            <input type="email" class="input input-bordered input-sm" formControlName="email"
              placeholder="e.g. info@company.com" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Phone</span></label>
            <input type="tel" class="input input-bordered input-sm" formControlName="phone"
              placeholder="e.g. 020 1234 5678" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="contractorForm.invalid">Register Contractor</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading contractors..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadContractors()"></app-error-state>
    } @else if ((contractors$ | async)?.length === 0) {
      @if (searchTerm || typeFilter || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Contractors</h3>
          <p class="text-base-content/60 mt-2">No contractors match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Contractors Registered"
          message="Build your contractor directory by registering companies you work with. Track their insurance, certifications, and performance to make informed procurement decisions.">
          <button class="btn btn-primary btn-sm" (click)="toggleForm()">Register Your First Contractor</button>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Contractors directory">
            <thead>
              <tr>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('companyName')">
                  Company {{ getSortIcon('companyName') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('type')">
                  Type {{ getSortIcon('type') }}
                </th>
                <th>Trade</th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('rating')">
                  Rating {{ getSortIcon('rating') }}
                </th>
                <th>Contact</th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('status')">
                  Status {{ getSortIcon('status') }}
                </th>
              </tr>
            </thead>
            <tbody>
              @for (contractor of contractors$ | async; track contractor.id) {
                <tr class="hover">
                  <td class="font-medium">{{ contractor.companyName }}</td>
                  <td><span class="badge badge-sm badge-outline">{{ formatType(contractor.type) }}</span></td>
                  <td class="text-sm">{{ contractor.trade ?? '—' }}</td>
                  <td>
                    @if (contractor.rating !== null) {
                      <span class="font-mono text-sm">{{ contractor.rating }}/5</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td class="text-sm">
                    @if (contractor.contactName) {
                      <div>{{ contractor.contactName }}</div>
                      @if (contractor.email) {
                        <div class="text-xs text-base-content/50">{{ contractor.email }}</div>
                      }
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td><app-status-badge [status]="contractor.status"></app-status-badge></td>
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

    <!-- Activity Feed -->
    <div class="mt-6">
      <app-activity-feed module="Contractor" title="Recent Activity" [limit]="5"></app-activity-feed>
    </div>
  `
})
export class ContractorListComponent implements OnInit {
  contractors$: Observable<ContractorItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  typeFilter: ContractorType | '' = '';
  statusFilter: ContractorStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showForm = false;
  private totalCountValue = 0;

  contractorForm = new FormGroup({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<ContractorType | ''>('', { nonNullable: true, validators: [Validators.required] }),
    trade: new FormControl('', { nonNullable: true }),
    contactName: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.contractors$ = this.store.select(ContractorsSelectors.selectAllContractors);
    this.loading$ = this.store.select(ContractorsSelectors.selectContractorsLoading);
    this.error$ = this.store.select(ContractorsSelectors.selectContractorsError);
    this.totalCount$ = this.store.select(ContractorsSelectors.selectContractorsTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadContractors();
  }

  loadContractors(): void {
    this.store.dispatch(ContractorsActions.loadContractors({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      type: this.typeFilter || undefined,
      status: this.statusFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadContractors();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadContractors();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.typeFilter = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadContractors();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.contractorForm.reset();
    }
  }

  exportCsv(): void {
    this.contractors$.subscribe(contractors => {
      const headers = ['Company', 'Type', 'Trade', 'Rating', 'Contact', 'Email', 'Status'];
      const rows = contractors.map(c => [
        c.companyName,
        c.type,
        c.trade ?? '',
        c.rating?.toString() ?? '',
        c.contactName ?? '',
        c.email ?? '',
        c.status
      ]);
      exportToCsv('contractors', headers, rows);
    }).unsubscribe();
  }

  onSubmit(): void {
    if (this.contractorForm.invalid) return;

    const formValue = this.contractorForm.getRawValue();
    const request: CreateContractorRequest = {
      companyName: formValue.companyName,
      type: formValue.type as ContractorType,
      trade: formValue.trade || undefined,
      contactName: formValue.contactName || undefined,
      email: formValue.email || undefined,
      phone: formValue.phone || undefined
    };

    this.store.dispatch(ContractorsActions.createContractor({ request }));
    this.contractorForm.reset();
    this.showForm = false;
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadContractors();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  formatType(type: ContractorType): string {
    switch (type) {
      case 'MainContractor': return 'Main Contractor';
      case 'Subcontractor': return 'Subcontractor';
      case 'Consultant': return 'Consultant';
      case 'Supplier': return 'Supplier';
      case 'Specialist': return 'Specialist';
      default: return type;
    }
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
    this.loadContractors();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadContractors();
  }
}
