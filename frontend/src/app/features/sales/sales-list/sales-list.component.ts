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
import { SalesLeadItem, LeadStatus, LeadSource, CreateSalesLeadRequest } from '../../../core/models/sales.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as SalesActions from '../store/sales.actions';
import * as SalesSelectors from '../store/sales.selectors';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent,
    ErrorStateComponent, SearchBoxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Sales & Conveyancing'}, {label: 'Leads'}]"></app-breadcrumb>
    <app-page-header title="Sales & Conveyancing" subtitle="Manage leads, viewings, reservations, and the sales pipeline">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Add Lead</button>
    </app-page-header>
    <app-page-description
      description="Sales manages your lead pipeline from initial enquiry through to legal completion. Each lead progresses through stages: New → Contacted → Qualified → Viewing → Offer → Reserved → Exchanged → Completed."
      guidance="Search by lead name or filter by status to focus on specific pipeline stages. Click Add Lead to register a new prospect."
      helpLink="/help/sales/sales-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by lead name..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Viewing">Viewing</option>
        <option value="Offer">Offer</option>
        <option value="Reserved">Reserved</option>
        <option value="Exchanged">Exchanged</option>
        <option value="Completed">Completed</option>
        <option value="Lost">Lost</option>
      </select>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Register New Sales Lead</h3>
        <form [formGroup]="leadForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Lead Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="name"
              placeholder="e.g. James Wilson" />
            @if (leadForm.get('name')?.touched && leadForm.get('name')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Lead name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Source *</span></label>
            <select class="select select-bordered select-sm" formControlName="source">
              <option value="">Select source...</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Agent">Agent</option>
              <option value="Advertisement">Advertisement</option>
              <option value="WalkIn">Walk In</option>
              <option value="Portal">Portal</option>
              <option value="Other">Other</option>
            </select>
            @if (leadForm.get('source')?.touched && leadForm.get('source')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Source is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Email</span></label>
            <input type="email" class="input input-bordered input-sm" formControlName="email"
              placeholder="e.g. james@email.com" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Phone</span></label>
            <input type="tel" class="input input-bordered input-sm" formControlName="phone"
              placeholder="e.g. 07700 900000" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Budget</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="budget"
              placeholder="e.g. 400000" min="0" step="0.01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="leadForm.invalid">Register Lead</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading sales leads..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadLeads()"></app-error-state>
    } @else if ((leads$ | async)?.length === 0) {
      @if (searchTerm || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Leads</h3>
          <p class="text-base-content/60 mt-2">No sales leads match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Sales Leads Yet"
          message="Start building your sales pipeline by registering leads. Track enquiries from initial contact through to legal completion and handover.">
          <button class="btn btn-primary btn-sm" (click)="toggleForm()">Register Your First Lead</button>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Sales leads">
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Budget</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              @for (lead of leads$ | async; track lead.id) {
                <tr class="hover">
                  <td class="font-medium">{{ lead.name }}</td>
                  <td><span class="badge badge-sm badge-outline">{{ formatSource(lead.source) }}</span></td>
                  <td class="text-sm">{{ lead.email ?? '—' }}</td>
                  <td class="text-sm">{{ lead.phone ?? '—' }}</td>
                  <td class="font-mono text-sm">
                    @if (lead.budget) {
                      {{ lead.currency }} {{ lead.budget | number:'1.0-0' }}
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td class="text-xs font-mono">{{ lead.interestedUnitRef ?? '—' }}</td>
                  <td><app-status-badge [status]="lead.status"></app-status-badge></td>
                  <td class="text-xs text-base-content/50">{{ lead.createdAt | date:'mediumDate' }}</td>
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
export class SalesListComponent implements OnInit {
  leads$: Observable<SalesLeadItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: LeadStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  showForm = false;
  private totalCountValue = 0;

  leadForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    source: new FormControl<LeadSource | ''>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    budget: new FormControl<number | null>(null),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.leads$ = this.store.select(SalesSelectors.selectAllSalesLeads);
    this.loading$ = this.store.select(SalesSelectors.selectSalesLoading);
    this.error$ = this.store.select(SalesSelectors.selectSalesError);
    this.totalCount$ = this.store.select(SalesSelectors.selectSalesTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {
    this.store.dispatch(SalesActions.loadSalesLeads({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadLeads();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadLeads();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadLeads();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.leadForm.reset();
    }
  }

  onSubmit(): void {
    if (this.leadForm.invalid) return;

    const formValue = this.leadForm.getRawValue();
    const request: CreateSalesLeadRequest = {
      name: formValue.name,
      source: formValue.source as LeadSource,
      email: formValue.email || undefined,
      phone: formValue.phone || undefined,
      budget: formValue.budget ?? undefined,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(SalesActions.createSalesLead({ request }));
    this.leadForm.reset();
    this.showForm = false;
  }

  exportCsv(): void {
    this.leads$.subscribe(leads => {
      const headers = ['Name', 'Source', 'Email', 'Phone', 'Budget', 'Currency', 'Unit Ref', 'Status', 'Created'];
      const rows = leads.map(l => [
        l.name,
        l.source,
        l.email ?? '',
        l.phone ?? '',
        l.budget?.toString() ?? '',
        l.currency ?? '',
        l.interestedUnitRef ?? '',
        l.status,
        l.createdAt ?? ''
      ]);
      exportToCsv('sales-leads', headers, rows);
    }).unsubscribe();
  }

  formatSource(source: LeadSource): string {
    switch (source) {
      case 'WalkIn': return 'Walk In';
      default: return source;
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
    this.loadLeads();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadLeads();
  }
}
