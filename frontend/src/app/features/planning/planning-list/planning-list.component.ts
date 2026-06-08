import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
import { PlanningApplicationListItem, PlanningApplicationStatus } from '../../../core/models/planning.model';
import * as PlanningActions from '../store/planning.actions';
import * as PlanningSelectors from '../store/planning.selectors';

@Component({
  selector: 'app-planning-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, PageHeaderComponent, PageDescriptionComponent,
    BreadcrumbComponent, LoadingStateComponent, EmptyStateComponent,
    StatusBadgeComponent, ErrorStateComponent, SearchBoxComponent, ActivityFeedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Planning & Approvals'}, {label: 'Applications'}]"></app-breadcrumb>
    <app-page-header title="Planning Applications" subtitle="Manage planning applications and track their progress through the approval process">
      <a routerLink="/planning/new" class="btn btn-primary btn-sm">+ Create Application</a>
    </app-page-header>
    <app-page-description
      description="Planning applications are submitted to local councils after land is acquired. Each application progresses through a lifecycle: Pre-Application → Submitted → Validated → Under Review → Decision."
      guidance="Use the search and filters below to find specific applications. Click any row to view full details, conditions, and appeals."
      helpLink="/help/planning/planning-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by reference, description or authority..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="PreApplication">Pre-Application</option>
        <option value="Submitted">Submitted</option>
        <option value="Validated">Validated</option>
        <option value="UnderReview">Under Review</option>
        <option value="CommitteeReview">Committee Review</option>
        <option value="Approved">Approved</option>
        <option value="ApprovedWithConditions">Approved with Conditions</option>
        <option value="Refused">Refused</option>
        <option value="Appeal">Appeal</option>
        <option value="Withdrawn">Withdrawn</option>
      </select>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading planning applications..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadApplications()"></app-error-state>
    } @else if ((applications$ | async)?.length === 0) {
      @if (searchTerm || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Applications</h3>
          <p class="text-base-content/60 mt-2">No planning applications match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Planning Applications Yet"
          message="Create your first planning application to begin tracking submissions to local councils, conditions, and appeals.">
          <a routerLink="/planning/new" class="btn btn-primary btn-sm">Create Your First Application</a>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Planning applications">
            <thead>
              <tr>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('reference')">
                  Reference {{ getSortIcon('reference') }}
                </th>
                <th>Description</th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('localauthority')">
                  Local Authority {{ getSortIcon('localauthority') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('status')">
                  Status {{ getSortIcon('status') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('submissiondate')">
                  Submitted {{ getSortIcon('submissiondate') }}
                </th>
                <th>Conditions</th>
              </tr>
            </thead>
            <tbody>
              @for (app of applications$ | async; track app.id) {
                <tr class="hover cursor-pointer" [routerLink]="['/planning', app.id]" role="link" tabindex="0">
                  <td class="font-medium font-mono text-sm">{{ app.applicationReference }}</td>
                  <td class="max-w-[300px] truncate">{{ app.description }}</td>
                  <td>{{ app.localAuthority }}</td>
                  <td><app-status-badge [status]="app.status"></app-status-badge></td>
                  <td class="text-xs text-base-content/50">{{ app.submissionDate ? (app.submissionDate | date:'mediumDate') : '—' }}</td>
                  <td>
                    @if (app.conditionCount > 0) {
                      <span class="badge badge-sm badge-outline">{{ app.conditionCount }}</span>
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
      <app-activity-feed module="PlanningApplication" title="Recent Activity" [limit]="5"></app-activity-feed>
    </div>
  `
})
export class PlanningListComponent implements OnInit {
  applications$: Observable<PlanningApplicationListItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: PlanningApplicationStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  private totalCountValue = 0;

  constructor(private store: Store) {
    this.applications$ = this.store.select(PlanningSelectors.selectAllApplications);
    this.loading$ = this.store.select(PlanningSelectors.selectPlanningLoading);
    this.error$ = this.store.select(PlanningSelectors.selectPlanningError);
    this.totalCount$ = this.store.select(PlanningSelectors.selectPlanningTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.store.dispatch(PlanningActions.loadApplications({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadApplications();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadApplications();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadApplications();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadApplications();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
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
    this.loadApplications();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadApplications();
  }

  exportCsv(): void {
    let apps: PlanningApplicationListItem[] = [];
    this.applications$.subscribe(a => apps = a).unsubscribe();
    const headers = ['Reference', 'Description', 'Local Authority', 'Type', 'Status', 'Submitted', 'Conditions'];
    const rows = apps.map(a => [
      a.applicationReference, a.description, a.localAuthority, a.applicationType,
      a.status, a.submissionDate ?? '', String(a.conditionCount)
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning_applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
