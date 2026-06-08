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
import { DefectItem, DefectStatus, DefectPriority, CreateDefectRequest } from '../../../core/models/defect.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as DefectsActions from '../store/defects.actions';
import * as DefectsSelectors from '../store/defects.selectors';

@Component({
  selector: 'app-defect-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent,
    ErrorStateComponent, SearchBoxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Defects & Warranty'}, {label: 'Defect Register'}]"></app-breadcrumb>
    <app-page-header title="Defect Register" subtitle="Track and manage post-completion defects, warranty claims, and remedial works">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Report Defect</button>
    </app-page-header>
    <app-page-description
      description="The defect register tracks all post-completion defects reported by homeowners, site managers, or inspection teams. Each defect is triaged by priority, assigned for resolution, and tracked through to verified closure. Use this to manage your defects liability period effectively."
      guidance="Search by defect title or location. Filter by status or priority to focus on critical items. Report new defects using the inline form."
      helpLink="/help/defects/defects-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search by title or location..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="InProgress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Verified">Verified</option>
        <option value="Closed">Closed</option>
        <option value="Rejected">Rejected</option>
      </select>
      <select class="select select-bordered select-sm" [(ngModel)]="priorityFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by priority">
        <option value="">All Priorities</option>
        <option value="Critical">Critical</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    <!-- Inline Report Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Report New Defect</h3>
        <form [formGroup]="defectForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Title *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="title"
              placeholder="e.g. Cracked bathroom tile Unit 12" />
            @if (defectForm.get('title')?.touched && defectForm.get('title')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Defect title is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Priority *</span></label>
            <select class="select select-bordered select-sm" formControlName="priority">
              <option value="">Select priority...</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            @if (defectForm.get('priority')?.touched && defectForm.get('priority')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Priority is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Location</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="location"
              placeholder="e.g. Block A, Floor 2, Unit 12" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Unit Reference</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="unitReference"
              placeholder="e.g. A2-12" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Description</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="description"
              placeholder="Detailed description of the defect" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Assigned To</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="assignedTo"
              placeholder="e.g. ABC Contractors" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="defectForm.invalid">Report Defect</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading defects..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadDefects()"></app-error-state>
    } @else if ((defects$ | async)?.length === 0) {
      @if (searchTerm || statusFilter || priorityFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Defects</h3>
          <p class="text-base-content/60 mt-2">No defects match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Defects Reported"
          message="No defects have been reported yet. When homeowners or inspectors identify post-completion issues, report them here to track resolution through to closure.">
          <button class="btn btn-primary btn-sm" (click)="toggleForm()">Report First Defect</button>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Defect register">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Location</th>
                <th>Unit</th>
                <th>Assigned To</th>
                <th>Reported</th>
                <th>Resolved</th>
              </tr>
            </thead>
            <tbody>
              @for (defect of defects$ | async; track defect.id) {
                <tr class="hover">
                  <td class="font-medium">{{ defect.title }}</td>
                  <td>
                    <span class="badge badge-sm" [ngClass]="{
                      'badge-error': defect.priority === 'Critical',
                      'badge-warning': defect.priority === 'High',
                      'badge-info': defect.priority === 'Medium',
                      'badge-ghost': defect.priority === 'Low'
                    }">{{ defect.priority }}</span>
                  </td>
                  <td><app-status-badge [status]="defect.status"></app-status-badge></td>
                  <td class="text-sm">{{ defect.location ?? '—' }}</td>
                  <td class="text-sm font-mono">{{ defect.unitReference ?? '—' }}</td>
                  <td class="text-sm">{{ defect.assignedTo ?? '—' }}</td>
                  <td class="text-xs text-base-content/50">{{ defect.reportedDate | date:'mediumDate' }}</td>
                  <td class="text-xs text-base-content/50">{{ defect.resolvedDate ? (defect.resolvedDate | date:'mediumDate') : '—' }}</td>
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
export class DefectListComponent implements OnInit {
  defects$: Observable<DefectItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: DefectStatus | '' = '';
  priorityFilter: DefectPriority | '' = '';
  currentPage = 1;
  pageSize = 25;
  showForm = false;
  private totalCountValue = 0;

  defectForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    priority: new FormControl<DefectPriority | ''>('', { nonNullable: true, validators: [Validators.required] }),
    location: new FormControl('', { nonNullable: true }),
    unitReference: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    assignedTo: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.defects$ = this.store.select(DefectsSelectors.selectAllDefects);
    this.loading$ = this.store.select(DefectsSelectors.selectDefectsLoading);
    this.error$ = this.store.select(DefectsSelectors.selectDefectsError);
    this.totalCount$ = this.store.select(DefectsSelectors.selectDefectsTotalCount);
    this.totalCount$.subscribe(count => this.totalCountValue = count);
  }

  ngOnInit(): void {
    this.loadDefects();
  }

  loadDefects(): void {
    this.store.dispatch(DefectsActions.loadDefects({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadDefects();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadDefects();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.currentPage = 1;
    this.loadDefects();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.defectForm.reset();
    }
  }

  onSubmit(): void {
    if (this.defectForm.invalid) return;

    const formValue = this.defectForm.getRawValue();
    const request: CreateDefectRequest = {
      title: formValue.title,
      priority: formValue.priority as DefectPriority,
      location: formValue.location || undefined,
      unitReference: formValue.unitReference || undefined,
      description: formValue.description || undefined,
      assignedTo: formValue.assignedTo || undefined,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(DefectsActions.createDefect({ request }));
    this.defectForm.reset();
    this.showForm = false;
  }

  exportCsv(): void {
    this.defects$.subscribe(defects => {
      const headers = ['Title', 'Priority', 'Status', 'Location', 'Unit', 'Assigned To', 'Reported Date', 'Resolved Date'];
      const rows = defects.map(d => [
        d.title,
        d.priority,
        d.status,
        d.location ?? '',
        d.unitReference ?? '',
        d.assignedTo ?? '',
        d.reportedDate ?? '',
        d.resolvedDate ?? ''
      ]);
      exportToCsv('defects', headers, rows);
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
    this.loadDefects();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadDefects();
  }
}
