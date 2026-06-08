import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityName: string;
  entityId: string;
  oldValues: string | null;
  newValues: string | null;
  affectedColumns: string | null;
  timestamp: string;
  ipAddress: string | null;
  correlationId: string | null;
}

/**
 * Admin Audit Log viewer.
 * Uses direct HttpClient calls with component-level state (no NgRx).
 * Provides a paginated, filterable view of all system audit events.
 */
@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Administration'}, {label: 'Audit Log'}]"></app-breadcrumb>
    <app-page-header title="Audit Log" subtitle="Immutable record of all system actions for compliance and investigation">
    </app-page-header>
    <app-page-description
      description="The Audit Log captures every create, update, and delete action performed across the platform. Each entry records who performed the action, when it occurred, which entity was affected, and what changed. This log is immutable and cannot be deleted."
      guidance="Use the filters below to narrow results by entity type or user ID. The audit trail supports compliance reviews, incident investigation, and data reconciliation."
      helpLink="/help/admin/audit-log-overview"
    ></app-page-description>

    <!-- Filters -->
    <div class="flex flex-wrap items-end gap-3 mb-4">
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">Entity Name</span></div>
        <input type="text" class="input input-bordered input-sm"
          placeholder="e.g. LandOpportunity, Project"
          [(ngModel)]="entityNameFilter" (keyup.enter)="onFilter()" aria-label="Filter by entity name" />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">User ID</span></div>
        <input type="text" class="input input-bordered input-sm"
          placeholder="e.g. user-guid"
          [(ngModel)]="userIdFilter" (keyup.enter)="onFilter()" aria-label="Filter by user ID" />
      </label>
      <button class="btn btn-sm btn-outline" (click)="onFilter()">Filter</button>
      <button class="btn btn-sm btn-ghost" (click)="clearFilters()">Clear</button>
    </div>

    @if (loading) {
      <app-loading-state message="Loading audit log entries..."></app-loading-state>
    } @else if (error) {
      <app-error-state [message]="error" (retry)="loadAuditLogs()"></app-error-state>
    } @else if (entries.length === 0) {
      <app-empty-state
        title="No Audit Log Entries"
        message="No audit events match your current filters. All system actions are automatically recorded as they occur.">
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra table-sm" aria-label="Audit log entries">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of entries; track entry.id) {
                <tr class="hover">
                  <td class="text-xs text-base-content/70 whitespace-nowrap">{{ entry.timestamp | date:'medium' }}</td>
                  <td class="text-sm">{{ entry.userName || entry.userId }}</td>
                  <td>
                    <span class="badge badge-sm"
                      [class.badge-success]="entry.action === 'Create'"
                      [class.badge-warning]="entry.action === 'Update'"
                      [class.badge-error]="entry.action === 'Delete'">
                      {{ entry.action }}
                    </span>
                  </td>
                  <td class="font-mono text-sm">{{ entry.entityName }}</td>
                  <td class="font-mono text-xs text-base-content/50 max-w-[120px] truncate" [title]="entry.entityId">{{ entry.entityId }}</td>
                  <td class="text-xs max-w-[200px] truncate" [title]="entry.affectedColumns ?? ''">
                    {{ entry.affectedColumns ?? '—' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        @if (totalCount > pageSize) {
          <div class="flex items-center justify-between px-4 py-3 border-t border-base-300">
            <span class="text-sm text-base-content/60">
              Showing {{ ((currentPage - 1) * pageSize) + 1 }}–{{ currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize }}
              of {{ totalCount }} entries
            </span>
            <div class="join">
              <button class="join-item btn btn-sm" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">«</button>
              <button class="join-item btn btn-sm btn-active">{{ currentPage }}</button>
              <button class="join-item btn btn-sm" [disabled]="(currentPage * pageSize) >= totalCount" (click)="changePage(currentPage + 1)">»</button>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class AuditLogComponent implements OnInit {
  entries: AuditLogEntry[] = [];
  loading = false;
  error: string | null = null;
  totalCount = 0;
  currentPage = 1;
  pageSize = 25;

  entityNameFilter = '';
  userIdFilter = '';

  private readonly apiUrl = `${environment.apiUrl}/admin/audit-logs`;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('pageSize', this.pageSize.toString());

    if (this.entityNameFilter) {
      params = params.set('entityName', this.entityNameFilter);
    }
    if (this.userIdFilter) {
      params = params.set('userId', this.userIdFilter);
    }

    this.http.get<ApiResponse<AuditLogEntry[]>>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.entries = response.data;
        this.totalCount = response.pagination?.totalCount ?? response.data.length;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.error?.errors?.[0] ?? 'Failed to load audit log entries';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadAuditLogs();
  }

  clearFilters(): void {
    this.entityNameFilter = '';
    this.userIdFilter = '';
    this.currentPage = 1;
    this.loadAuditLogs();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadAuditLogs();
  }
}
