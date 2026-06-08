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
import { ReportItem, CreateReportRequest } from '../../../core/models/report.model';
import * as ReportsActions from '../store/reports.actions';
import * as ReportsSelectors from '../store/reports.selectors';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Reports'}, {label: 'All Reports'}]"></app-breadcrumb>
    <app-page-header title="Reports & Dashboards" subtitle="Generate and manage reports across all project areas">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Create Report</button>
    </app-page-header>
    <app-page-description
      description="The Reports module allows you to create, schedule, and manage reports covering financial performance, sales progress, construction milestones, and compliance status. Reports are generated from live project data and can be parameterised for specific periods or projects."
      guidance="Search for existing reports or create a new report definition using the form above. Generated reports can be exported for stakeholder distribution."
      helpLink="/help/reports/reports-overview"
    ></app-page-description>

    <!-- Search Control -->
    <div class="flex items-end gap-3 mb-4">
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">Search</span></div>
        <input type="text" class="input input-bordered input-sm"
          placeholder="Search by title or type..."
          [(ngModel)]="searchTerm" (keyup.enter)="onSearch()" aria-label="Search reports" />
      </label>
      <button class="btn btn-sm btn-outline" (click)="onSearch()">Search</button>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">New Report Definition</h3>
        <form [formGroup]="reportForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Title *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="title"
              placeholder="e.g. Monthly Financial Summary" />
            @if (reportForm.get('title')?.touched && reportForm.get('title')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Title is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Report Type *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="reportType"
              placeholder="e.g. Financial, Sales, Construction" />
            @if (reportForm.get('reportType')?.touched && reportForm.get('reportType')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Report type is required</span></label>
            }
          </div>
          <div class="form-control md:col-span-2">
            <label class="label"><span class="label-text">Description</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="description"
              placeholder="Brief description of what this report covers" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="reportForm.invalid">Create Report</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading reports..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="onSearch()"></app-error-state>
    } @else if ((reports$ | async)?.length === 0) {
      <app-empty-state
        title="No Reports Found"
        message="Create your first report to begin generating insights from your project data. Reports provide executives and managers with timely, accurate information for decision-making.">
        <button class="btn btn-primary btn-sm" (click)="toggleForm()">Create Your First Report</button>
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Reports list">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Generated By</th>
                <th>Last Generated</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              @for (report of reports$ | async; track report.id) {
                <tr class="hover">
                  <td class="font-medium">{{ report.title }}</td>
                  <td><app-status-badge [status]="report.reportType"></app-status-badge></td>
                  <td class="text-sm">{{ report.generatedBy ?? '—' }}</td>
                  <td class="text-xs text-base-content/50">{{ report.lastGeneratedAt ? (report.lastGeneratedAt | date:'medium') : 'Never' }}</td>
                  <td class="text-xs text-base-content/50">{{ report.createdAt | date:'mediumDate' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        @if ((totalCount$ | async)! > pageSize) {
          <div class="flex items-center justify-between px-4 py-3 border-t border-base-300">
            <span class="text-sm text-base-content/60">
              Showing {{ ((currentPage - 1) * pageSize) + 1 }}–{{ currentPage * pageSize > (totalCount$ | async)! ? (totalCount$ | async) : currentPage * pageSize }}
              of {{ totalCount$ | async }} reports
            </span>
            <div class="join">
              <button class="join-item btn btn-sm" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">«</button>
              <button class="join-item btn btn-sm btn-active">{{ currentPage }}</button>
              <button class="join-item btn btn-sm" [disabled]="(currentPage * pageSize) >= (totalCount$ | async)!" (click)="changePage(currentPage + 1)">»</button>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class ReportListComponent implements OnInit {
  reports$: Observable<ReportItem[]>;
  loading$: Observable<boolean>;
  totalCount$: Observable<number>;
  error$: Observable<string | null>;

  searchTerm = '';
  showForm = false;
  currentPage = 1;
  pageSize = 20;

  reportForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    reportType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.reports$ = this.store.select(ReportsSelectors.selectReports);
    this.loading$ = this.store.select(ReportsSelectors.selectReportsLoading);
    this.totalCount$ = this.store.select(ReportsSelectors.selectReportsTotalCount);
    this.error$ = this.store.select(ReportsSelectors.selectReportsError);
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.store.dispatch(ReportsActions.loadReports({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined
    }));
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadReports();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadReports();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.reportForm.reset();
    }
  }

  onSubmit(): void {
    if (this.reportForm.invalid) return;

    const formValue = this.reportForm.getRawValue();
    const request: CreateReportRequest = {
      title: formValue.title,
      reportType: formValue.reportType,
      description: formValue.description || undefined
    };

    this.store.dispatch(ReportsActions.createReport({ request }));
    this.reportForm.reset();
    this.showForm = false;
  }
}
