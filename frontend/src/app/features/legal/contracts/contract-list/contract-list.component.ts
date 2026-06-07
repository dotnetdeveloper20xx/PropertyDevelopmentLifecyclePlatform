import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { ContractListItem, ContractStatus } from '../../../../core/models/legal.model';
import * as LegalActions from '../../store/legal.actions';
import * as LegalSelectors from '../../store/legal.selectors';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, PageHeaderComponent, PageDescriptionComponent,
    BreadcrumbComponent, LoadingStateComponent, EmptyStateComponent,
    StatusBadgeComponent, ErrorStateComponent, SearchBoxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Legal & Compliance'}, {label: 'Contracts'}]"></app-breadcrumb>
    <app-page-header title="Contracts" subtitle="Manage legal contracts across all land acquisitions and development projects">
      <a routerLink="/legal/contracts/new" class="btn btn-primary btn-sm">+ Create Contract</a>
    </app-page-header>
    <app-page-description
      description="Contracts track all legal agreements related to land acquisitions, sales, leases, and partnerships. Each contract progresses through a lifecycle from Draft to Completion or Termination."
      guidance="Use search and filters below to find specific contracts. Click any row to view full details, linked documents, and tasks."
      helpLink="/help/legal/contracts-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by reference, title or counterparty..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Draft">Draft</option>
        <option value="UnderReview">Under Review</option>
        <option value="AwaitingSignature">Awaiting Signature</option>
        <option value="Exchanged">Exchanged</option>
        <option value="Completed">Completed</option>
        <option value="Terminated">Terminated</option>
        <option value="Expired">Expired</option>
      </select>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading contracts..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadContracts()"></app-error-state>
    } @else if ((contracts$ | async)?.length === 0) {
      @if (searchTerm || statusFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Contracts</h3>
          <p class="text-base-content/60 mt-2">No contracts match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Contracts Yet"
          message="Create your first legal contract to begin managing agreements, track exchange and completion dates, and link documents.">
          <a routerLink="/legal/contracts/new" class="btn btn-primary btn-sm">Create Your First Contract</a>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Legal contracts">
            <thead>
              <tr>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('reference')">
                  Reference {{ getSortIcon('reference') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('title')">
                  Title {{ getSortIcon('title') }}
                </th>
                <th>Counterparty</th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('type')">
                  Type {{ getSortIcon('type') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('status')">
                  Status {{ getSortIcon('status') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('value')">
                  Value {{ getSortIcon('value') }}
                </th>
                <th class="cursor-pointer hover:bg-base-200" (click)="sortBy('created')">
                  Created {{ getSortIcon('created') }}
                </th>
              </tr>
            </thead>
            <tbody>
              @for (contract of contracts$ | async; track contract.id) {
                <tr class="hover cursor-pointer" [routerLink]="['/legal/contracts', contract.id]" role="link" tabindex="0">
                  <td class="font-medium font-mono text-sm">{{ contract.contractReference }}</td>
                  <td class="max-w-[250px] truncate">{{ contract.title }}</td>
                  <td>{{ contract.counterpartyName }}</td>
                  <td class="text-sm">{{ formatType(contract.contractType) }}</td>
                  <td><app-status-badge [status]="contract.status"></app-status-badge></td>
                  <td class="text-sm">{{ contract.contractValue ? ('£' + (contract.contractValue | number:'1.0-0')) : '—' }}</td>
                  <td class="text-xs text-base-content/50">{{ contract.createdAt | date:'mediumDate' }}</td>
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
export class ContractListComponent implements OnInit {
  contracts$: Observable<ContractListItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: ContractStatus | '' = '';
  currentPage = 1;
  pageSize = 25;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  private totalCountValue = 0;

  constructor(private store: Store) {
    this.contracts$ = this.store.select(LegalSelectors.selectAllContracts);
    this.loading$ = this.store.select(LegalSelectors.selectLegalLoading);
    this.error$ = this.store.select(LegalSelectors.selectLegalError);
    this.totalCount$ = this.store.select(LegalSelectors.selectContractsTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.store.dispatch(LegalActions.loadContracts({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadContracts();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadContracts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadContracts();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadContracts();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  formatType(type: string): string {
    return type.replace(/([A-Z])/g, ' $1').trim();
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
    this.loadContracts();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadContracts();
  }

  exportCsv(): void {
    let contracts: ContractListItem[] = [];
    this.contracts$.subscribe(c => contracts = c).unsubscribe();
    const headers = ['Reference', 'Title', 'Counterparty', 'Type', 'Status', 'Value', 'Created'];
    const rows = contracts.map(c => [
      c.contractReference, c.title, c.counterpartyName, c.contractType,
      c.status, c.contractValue?.toString() ?? '', c.createdAt
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contracts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
