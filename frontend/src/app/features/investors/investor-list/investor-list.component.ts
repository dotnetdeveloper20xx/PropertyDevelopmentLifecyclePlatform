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
import { InvestorItem, InvestorType, InvestorStatus, CreateInvestorRequest } from '../../../core/models/investor.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as InvestorsActions from '../store/investors.actions';
import * as InvestorsSelectors from '../store/investors.selectors';

@Component({
  selector: 'app-investor-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent,
    ErrorStateComponent, SearchBoxComponent, ActivityFeedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Investors & Funding'}, {label: 'Directory'}]"></app-breadcrumb>
    <app-page-header title="Investors & Funding" subtitle="Manage investor profiles, track investments, and monitor returns">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Add Investor</button>
    </app-page-header>
    <app-page-description
      description="The investor directory is your central register of all funding sources — individuals, corporates, institutional investors, family offices, and syndicates. Track their investment history, project participation, and returns."
      guidance="Search by investor name or company. Filter by type or status to find specific investors. Click Add Investor to register a new funding source."
      helpLink="/help/investors/investor-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by investor name or company..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="typeFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by type">
        <option value="">All Types</option>
        <option value="Individual">Individual</option>
        <option value="Corporate">Corporate</option>
        <option value="Institutional">Institutional</option>
        <option value="FamilyOffice">Family Office</option>
        <option value="Syndicate">Syndicate</option>
      </select>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Prospective">Prospective</option>
        <option value="Inactive">Inactive</option>
        <option value="Exited">Exited</option>
      </select>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Register New Investor</h3>
        <form [formGroup]="investorForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Investor Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="name"
              placeholder="e.g. John Smith or Acme Holdings" />
            @if (investorForm.get('name')?.touched && investorForm.get('name')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Investor name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Type *</span></label>
            <select class="select select-bordered select-sm" formControlName="type">
              <option value="">Select type...</option>
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
              <option value="Institutional">Institutional</option>
              <option value="FamilyOffice">Family Office</option>
              <option value="Syndicate">Syndicate</option>
            </select>
            @if (investorForm.get('type')?.touched && investorForm.get('type')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Type is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Company</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="company"
              placeholder="e.g. Acme Holdings Ltd" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Email</span></label>
            <input type="email" class="input input-bordered input-sm" formControlName="email"
              placeholder="e.g. investor@company.com" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Phone</span></label>
            <input type="tel" class="input input-bordered input-sm" formControlName="phone"
              placeholder="e.g. 020 1234 5678" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="investorForm.invalid">Register Investor</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading investors..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadInvestors()"></app-error-state>
    } @else if ((investors$ | async)?.length === 0) {
      @if (searchTerm || typeFilter || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Investors</h3>
          <p class="text-base-content/60 mt-2">No investors match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Investors Registered"
          message="Build your investor directory by registering funding sources. Track their contributions, project involvement, and returns to maintain strong investor relationships.">
          <button class="btn btn-primary btn-sm" (click)="toggleForm()">Register Your First Investor</button>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Investors directory">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Company</th>
                <th>Total Invested</th>
                <th>Projects</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (investor of investors$ | async; track investor.id) {
                <tr class="hover">
                  <td class="font-medium">{{ investor.name }}</td>
                  <td><span class="badge badge-sm badge-outline">{{ formatType(investor.type) }}</span></td>
                  <td class="text-sm">{{ investor.company ?? '—' }}</td>
                  <td class="font-mono text-sm">{{ investor.currency }} {{ investor.totalInvested | number:'1.2-2' }}</td>
                  <td>
                    @if (investor.projectCount > 0) {
                      <span class="badge badge-sm badge-outline">{{ investor.projectCount }}</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td class="text-sm">
                    @if (investor.email) {
                      <div class="text-xs text-base-content/50">{{ investor.email }}</div>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td><app-status-badge [status]="investor.status"></app-status-badge></td>
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
      <app-activity-feed module="Investor" title="Recent Activity" [limit]="5"></app-activity-feed>
    </div>
  `
})
export class InvestorListComponent implements OnInit {
  investors$: Observable<InvestorItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  typeFilter: InvestorType | '' = '';
  statusFilter: InvestorStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  showForm = false;
  private totalCountValue = 0;

  investorForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<InvestorType | ''>('', { nonNullable: true, validators: [Validators.required] }),
    company: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.investors$ = this.store.select(InvestorsSelectors.selectAllInvestors);
    this.loading$ = this.store.select(InvestorsSelectors.selectInvestorsLoading);
    this.error$ = this.store.select(InvestorsSelectors.selectInvestorsError);
    this.totalCount$ = this.store.select(InvestorsSelectors.selectInvestorsTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadInvestors();
  }

  loadInvestors(): void {
    this.store.dispatch(InvestorsActions.loadInvestors({
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
    this.loadInvestors();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadInvestors();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.typeFilter = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadInvestors();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.investorForm.reset();
    }
  }

  onSubmit(): void {
    if (this.investorForm.invalid) return;

    const formValue = this.investorForm.getRawValue();
    const request: CreateInvestorRequest = {
      name: formValue.name,
      type: formValue.type as InvestorType,
      company: formValue.company || undefined,
      email: formValue.email || undefined,
      phone: formValue.phone || undefined,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(InvestorsActions.createInvestor({ request }));
    this.investorForm.reset();
    this.showForm = false;
  }

  exportCsv(): void {
    this.investors$.subscribe(investors => {
      const headers = ['Name', 'Type', 'Company', 'Total Invested', 'Currency', 'Projects', 'Email', 'Status'];
      const rows = investors.map(i => [
        i.name,
        i.type,
        i.company ?? '',
        i.totalInvested.toString(),
        i.currency,
        i.projectCount.toString(),
        i.email ?? '',
        i.status
      ]);
      exportToCsv('investors', headers, rows);
    }).unsubscribe();
  }

  formatType(type: InvestorType): string {
    switch (type) {
      case 'Individual': return 'Individual';
      case 'Corporate': return 'Corporate';
      case 'Institutional': return 'Institutional';
      case 'FamilyOffice': return 'Family Office';
      case 'Syndicate': return 'Syndicate';
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
    this.loadInvestors();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadInvestors();
  }
}
