import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { OpportunityListItem, OpportunityStatus } from '../../../../core/models/opportunity.model';
import * as OpportunitiesActions from '../../store/opportunities.actions';
import * as OpportunitiesSelectors from '../../store/opportunities.selectors';

/**
 * Opportunity list with enterprise table features:
 * - Search (debounced, server-side)
 * - Status filter dropdown
 * - Column sorting (client-side for current page)
 * - Pagination controls
 * - Export placeholder
 */
@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, PageHeaderComponent, PageDescriptionComponent,
    BreadcrumbComponent, LoadingStateComponent, EmptyStateComponent,
    StatusBadgeComponent, ErrorStateComponent, SearchBoxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Land Acquisition'}, {label: 'Opportunities'}]"></app-breadcrumb>
    <app-page-header title="Land Opportunities" subtitle="Manage your acquisition pipeline">
      <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">+ Create Opportunity</a>
    </app-page-header>
    <app-page-description
      description="Land opportunities represent potential sites for development. Each opportunity progresses through a lifecycle: Identified → Initial Review → Due Diligence → Offer → Contract → Acquired."
      guidance="Use the search and filters below to find specific opportunities. Click any row to view full details."
      helpLink="/help/land-acquisition/la-pipeline"
    ></app-page-description>

    <!-- Toolbar: Search + Filters -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by name or location..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Identified">Identified</option>
        <option value="InitialReview">Initial Review</option>
        <option value="DueDiligence">Due Diligence</option>
        <option value="OfferMade">Offer Made</option>
        <option value="UnderContract">Under Contract</option>
        <option value="Acquired">Acquired</option>
        <option value="Withdrawn">Withdrawn</option>
      </select>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading opportunities..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadOpportunities()"></app-error-state>
    } @else if ((opportunities$ | async)?.length === 0) {
      @if (searchTerm || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Opportunities</h3>
          <p class="text-base-content/60 mt-2">No opportunities match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Land Opportunities Yet"
          message="Create your first opportunity to start tracking land acquisitions through due diligence, offer, and completion.">
          <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Your First Opportunity</a>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Land opportunities pipeline">
            <thead>
              <tr>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('name')">
                  Opportunity Name {{ getSortIcon('name') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('location')">
                  Location {{ getSortIcon('location') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('landSize')">
                  Land Size {{ getSortIcon('landSize') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('askingPrice')">
                  Asking Price {{ getSortIcon('askingPrice') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('status')">
                  Stage {{ getSortIcon('status') }}
                </th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              @for (opp of sortedOpportunities(); track opp.id) {
                <tr class="hover cursor-pointer" [routerLink]="['/opportunities', opp.id]" role="link" tabindex="0">
                  <td class="font-medium">{{ opp.name }}</td>
                  <td>{{ opp.location }}</td>
                  <td>{{ opp.landSize }} {{ opp.landSizeUnit }}</td>
                  <td>{{ opp.askingPrice ? ('£' + (opp.askingPrice | number:'1.0-0')) : '—' }}</td>
                  <td><app-status-badge [status]="opp.status"></app-status-badge></td>
                  <td class="text-xs text-base-content/50">{{ opp.createdAt | date:'mediumDate' }}</td>
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
export class OpportunityListComponent implements OnInit {
  opportunities$: Observable<OpportunityListItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  // Table state
  searchTerm = '';
  statusFilter: OpportunityStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';

  private allOpportunities: OpportunityListItem[] = [];

  constructor(private store: Store) {
    this.opportunities$ = this.store.select(OpportunitiesSelectors.selectAllOpportunities);
    this.loading$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesLoading);
    this.error$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesError);
    this.totalCount$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesTotalCount);

    // Track for client-side sorting
    this.opportunities$.subscribe(opps => this.allOpportunities = opps);
  }

  ngOnInit(): void {
    this.loadOpportunities();
  }

  loadOpportunities(): void {
    this.store.dispatch(OpportunitiesActions.loadOpportunities({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadOpportunities();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadOpportunities();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadOpportunities();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  sortedOpportunities(): OpportunityListItem[] {
    let list = [...this.allOpportunities];

    // Client-side status filter (if API doesn't support it yet)
    if (this.statusFilter) {
      list = list.filter(o => o.status === this.statusFilter);
    }

    if (!this.sortColumn) return list;

    return list.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[this.sortColumn];
      const bVal = (b as unknown as Record<string, unknown>)[this.sortColumn];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  totalPages(): number {
    const total = this.allOpportunities.length > 0
      ? Math.max(this.allOpportunities.length, 1) // Use actual if available
      : 1;
    return Math.ceil(total / this.pageSize);
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
    this.loadOpportunities();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadOpportunities();
  }
}
