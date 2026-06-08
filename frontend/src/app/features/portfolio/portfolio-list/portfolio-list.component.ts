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
import { PortfolioItem, PortfolioStatus, RiskLevel, CreatePortfolioRequest } from '../../../core/models/portfolio.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as PortfolioActions from '../store/portfolio.actions';
import * as PortfolioSelectors from '../store/portfolio.selectors';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent,
    ErrorStateComponent, SearchBoxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Portfolio Strategy'}, {label: 'Portfolios'}]"></app-breadcrumb>
    <app-page-header title="Portfolio Strategy" subtitle="Define and monitor development portfolio strategies across regions and risk profiles">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Create Portfolio</button>
    </app-page-header>
    <app-page-description
      description="Portfolio strategies define your development objectives — target units, investment levels, profit expectations, and risk appetite by region. Use portfolios to align acquisition decisions with your overall business strategy."
      guidance="Search by portfolio name, filter by status or risk level. Create new portfolio strategies to set targets for your development pipeline."
      helpLink="/help/portfolio/portfolio-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by portfolio name or region..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Draft">Draft</option>
        <option value="Active">Active</option>
        <option value="UnderReview">Under Review</option>
        <option value="Completed">Completed</option>
        <option value="Archived">Archived</option>
      </select>
      <select class="select select-bordered select-sm" [(ngModel)]="riskFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by risk level">
        <option value="">All Risk Levels</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    <!-- Inline Create Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Create New Portfolio Strategy</h3>
        <form [formGroup]="portfolioForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="name"
              placeholder="e.g. London Residential 2025" />
            @if (portfolioForm.get('name')?.touched && portfolioForm.get('name')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Portfolio name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Region</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="region"
              placeholder="e.g. South East" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Target Units *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="targetUnits"
              placeholder="e.g. 200" min="1" />
            @if (portfolioForm.get('targetUnits')?.touched && portfolioForm.get('targetUnits')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Target units is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Target Investment (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="targetInvestment"
              placeholder="e.g. 50000000" min="0" step="0.01" />
            @if (portfolioForm.get('targetInvestment')?.touched && portfolioForm.get('targetInvestment')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Target investment is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Target Profit (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="targetProfit"
              placeholder="e.g. 12000000" min="0" step="0.01" />
            @if (portfolioForm.get('targetProfit')?.touched && portfolioForm.get('targetProfit')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Target profit is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Risk Level *</span></label>
            <select class="select select-bordered select-sm" formControlName="riskLevel">
              <option value="">Select risk level...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            @if (portfolioForm.get('riskLevel')?.touched && portfolioForm.get('riskLevel')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Risk level is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Description</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="description"
              placeholder="Brief description of strategy" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="portfolioForm.invalid">Create Portfolio</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading portfolios..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadPortfolios()"></app-error-state>
    } @else if ((portfolios$ | async)?.length === 0) {
      @if (searchTerm || statusFilter || riskFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Portfolios</h3>
          <p class="text-base-content/60 mt-2">No portfolios match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Portfolio Strategies"
          message="Define your first portfolio strategy to set development targets by region, investment level, and risk appetite. Portfolios help align land acquisition and project decisions with your overall business objectives.">
          <button class="btn btn-primary btn-sm" (click)="toggleForm()">Create Your First Portfolio</button>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Portfolio strategies">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Target Units</th>
                <th>Target Investment</th>
                <th>Target Profit</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (item of portfolios$ | async; track item.id) {
                <tr class="hover">
                  <td class="font-medium">{{ item.name }}</td>
                  <td class="text-sm">{{ item.region ?? '—' }}</td>
                  <td class="font-mono text-sm">{{ item.targetUnits | number }}</td>
                  <td class="font-mono text-sm">£{{ item.targetInvestment | number:'1.0-0' }}</td>
                  <td class="font-mono text-sm">£{{ item.targetProfit | number:'1.0-0' }}</td>
                  <td>
                    <span class="badge badge-sm" [ngClass]="{
                      'badge-success': item.riskLevel === 'Low',
                      'badge-warning': item.riskLevel === 'Medium',
                      'badge-error': item.riskLevel === 'High' || item.riskLevel === 'Critical'
                    }">{{ item.riskLevel }}</span>
                  </td>
                  <td><app-status-badge [status]="item.status"></app-status-badge></td>
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
export class PortfolioListComponent implements OnInit {
  portfolios$: Observable<PortfolioItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: PortfolioStatus | '' = '';
  riskFilter: RiskLevel | '' = '';
  currentPage = 1;
  pageSize = 25;
  showForm = false;
  private totalCountValue = 0;

  portfolioForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    region: new FormControl('', { nonNullable: true }),
    targetUnits: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    targetInvestment: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    targetProfit: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    riskLevel: new FormControl<RiskLevel | ''>('', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.portfolios$ = this.store.select(PortfolioSelectors.selectAllPortfolios);
    this.loading$ = this.store.select(PortfolioSelectors.selectPortfolioLoading);
    this.error$ = this.store.select(PortfolioSelectors.selectPortfolioError);
    this.totalCount$ = this.store.select(PortfolioSelectors.selectPortfolioTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.store.dispatch(PortfolioActions.loadPortfolios({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
      riskLevel: this.riskFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadPortfolios();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPortfolios();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.riskFilter = '';
    this.currentPage = 1;
    this.loadPortfolios();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.portfolioForm.reset();
    }
  }

  onSubmit(): void {
    if (this.portfolioForm.invalid) return;

    const formValue = this.portfolioForm.getRawValue();
    const request: CreatePortfolioRequest = {
      name: formValue.name,
      description: formValue.description || undefined,
      region: formValue.region || undefined,
      targetUnits: formValue.targetUnits ?? 0,
      targetInvestment: formValue.targetInvestment ?? 0,
      targetProfit: formValue.targetProfit ?? 0,
      riskLevel: formValue.riskLevel as RiskLevel,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(PortfolioActions.createPortfolio({ request }));
    this.portfolioForm.reset();
    this.showForm = false;
  }

  exportCsv(): void {
    this.portfolios$.subscribe(portfolios => {
      const headers = ['Name', 'Region', 'Target Units', 'Target Investment', 'Target Profit', 'Risk Level', 'Status'];
      const rows = portfolios.map(p => [
        p.name,
        p.region ?? '',
        p.targetUnits.toString(),
        p.targetInvestment.toString(),
        p.targetProfit.toString(),
        p.riskLevel,
        p.status
      ]);
      exportToCsv('portfolio-strategies', headers, rows);
    }).unsubscribe();
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
    this.loadPortfolios();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadPortfolios();
  }
}
