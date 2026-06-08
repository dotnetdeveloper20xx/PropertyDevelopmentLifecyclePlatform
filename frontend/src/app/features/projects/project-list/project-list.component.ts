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
import { ProjectListItem, ProjectStatus } from '../../../core/models/project.model';
import * as ProjectsActions from '../store/projects.actions';
import * as ProjectsSelectors from '../store/projects.selectors';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, PageHeaderComponent, PageDescriptionComponent,
    BreadcrumbComponent, LoadingStateComponent, EmptyStateComponent,
    StatusBadgeComponent, ErrorStateComponent, SearchBoxComponent, ActivityFeedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Project Management'}, {label: 'Projects'}]"></app-breadcrumb>
    <app-page-header title="Projects" subtitle="Manage development projects, milestones, tasks, and risks across all sites">
      <a routerLink="/projects/new" class="btn btn-primary btn-sm">+ Create Project</a>
    </app-page-header>
    <app-page-description
      description="Projects are created from acquired land opportunities. Each project tracks milestones, tasks, budgets, and risks through the development lifecycle from Planning to Completion."
      guidance="Use search and filters below to find specific projects. Click any row to view full details including milestones, tasks, and risks."
      helpLink="/help/projects/project-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by reference, name or manager..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Planning">Planning</option>
        <option value="PreConstruction">Pre-Construction</option>
        <option value="InProgress">In Progress</option>
        <option value="OnHold">On Hold</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading projects..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadProjects()"></app-error-state>
    } @else if ((projects$ | async)?.length === 0) {
      @if (searchTerm || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Projects</h3>
          <p class="text-base-content/60 mt-2">No projects match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Projects Yet"
          message="Create your first development project to start tracking milestones, budgets, tasks, and risks across your sites.">
          <a routerLink="/projects/new" class="btn btn-primary btn-sm">Create Your First Project</a>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Development projects">
            <thead>
              <tr>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('reference')">
                  Reference {{ getSortIcon('reference') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('name')">
                  Name {{ getSortIcon('name') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('manager')">
                  Manager {{ getSortIcon('manager') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('status')">
                  Status {{ getSortIcon('status') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('progress')">
                  Progress {{ getSortIcon('progress') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('budget')">
                  Budget {{ getSortIcon('budget') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('targetEndDate')">
                  Target End {{ getSortIcon('targetEndDate') }}
                </th>
                <th>Milestones</th>
              </tr>
            </thead>
            <tbody>
              @for (project of projects$ | async; track project.id) {
                <tr class="hover cursor-pointer" [routerLink]="['/projects', project.id]" role="link" tabindex="0">
                  <td class="font-medium font-mono text-sm">{{ project.projectReference }}</td>
                  <td class="max-w-[250px] truncate">{{ project.name }}</td>
                  <td>{{ project.projectManager ?? '—' }}</td>
                  <td><app-status-badge [status]="project.status"></app-status-badge></td>
                  <td>
                    @if (project.progressPercent !== null) {
                      <div class="flex items-center gap-2">
                        <progress class="progress progress-primary w-16" [value]="project.progressPercent" max="100"></progress>
                        <span class="text-xs">{{ project.progressPercent }}%</span>
                      </div>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td class="text-sm">{{ project.budget ? ('£' + (project.budget | number:'1.0-0')) : '—' }}</td>
                  <td class="text-xs text-base-content/50">{{ project.targetEndDate ? (project.targetEndDate | date:'mediumDate') : '—' }}</td>
                  <td>
                    @if (project.milestoneCount > 0) {
                      <span class="badge badge-sm badge-outline">{{ project.milestoneCount }}</span>
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
      <app-activity-feed module="Project" title="Recent Activity" [limit]="5"></app-activity-feed>
    </div>
  `
})
export class ProjectListComponent implements OnInit {
  projects$: Observable<ProjectListItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: ProjectStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  private totalCountValue = 0;

  constructor(private store: Store) {
    this.projects$ = this.store.select(ProjectsSelectors.selectAllProjects);
    this.loading$ = this.store.select(ProjectsSelectors.selectProjectsLoading);
    this.error$ = this.store.select(ProjectsSelectors.selectProjectsError);
    this.totalCount$ = this.store.select(ProjectsSelectors.selectProjectsTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.store.dispatch(ProjectsActions.loadProjects({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadProjects();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProjects();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadProjects();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadProjects();
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
    this.loadProjects();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadProjects();
  }

  exportCsv(): void {
    let projects: ProjectListItem[] = [];
    this.projects$.subscribe(p => projects = p).unsubscribe();
    const headers = ['Reference', 'Name', 'Manager', 'Status', 'Progress', 'Budget', 'Target End', 'Milestones'];
    const rows = projects.map(p => [
      p.projectReference, p.name, p.projectManager ?? '', p.status,
      p.progressPercent?.toString() ?? '', p.budget?.toString() ?? '',
      p.targetEndDate ?? '', String(p.milestoneCount)
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
