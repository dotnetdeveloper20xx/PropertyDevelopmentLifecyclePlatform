import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ActivityFeedComponent } from '../../../shared/components/activity-feed/activity-feed.component';
import { DesignPackageItem } from '../../../core/models/design.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-design-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ActivityFeedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Design & Professional Services'}, {label: 'Packages'}]"></app-breadcrumb>
    <app-page-header title="Design Packages" subtitle="Manage architectural designs, engineering drawings, and consultant deliverables">
      <a routerLink="/design/new" class="btn btn-primary btn-sm">+ Create Package</a>
    </app-page-header>
    <app-page-description
      description="Design packages represent groups of professional deliverables — architectural drawings, structural engineering, MEP designs, and other consultant outputs. Each package goes through a review and approval workflow."
      guidance="All design packages are shown below. Click View or Edit to manage individual packages."
      helpLink="/help/design/design-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <input type="text" class="input input-bordered input-sm w-64" placeholder="Search packages..." [(ngModel)]="searchTerm" (ngModelChange)="filterPackages()" />
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    @if (loading) {
      <app-loading-state message="Loading design packages..."></app-loading-state>
    } @else if (filteredPackages.length === 0 && !searchTerm) {
      <app-empty-state
        title="No Design Packages"
        message="No design packages have been created yet. Create your first package to begin tracking architectural and engineering deliverables.">
      </app-empty-state>
    } @else if (filteredPackages.length === 0) {
      <app-empty-state title="No Results" message="No packages match your search."></app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300 mb-4">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Design packages">
            <thead>
              <tr>
                <th>Name</th>
                <th>Discipline</th>
                <th>Consultant</th>
                <th>Status</th>
                <th>Version</th>
                <th>Submitted</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (pkg of filteredPackages; track pkg.id) {
                <tr class="hover">
                  <td class="font-medium">{{ pkg.name }}</td>
                  <td class="text-sm">{{ pkg.discipline ?? '—' }}</td>
                  <td class="text-sm">{{ pkg.consultant ?? '—' }}</td>
                  <td><app-status-badge [status]="pkg.status"></app-status-badge></td>
                  <td><span class="badge badge-sm badge-outline">v{{ pkg.version }}</span></td>
                  <td class="text-xs text-base-content/50">{{ pkg.submittedDate ? (pkg.submittedDate | date:'mediumDate') : '—' }}</td>
                  <td class="text-xs text-base-content/50">{{ pkg.approvedDate ? (pkg.approvedDate | date:'mediumDate') : '—' }}</td>
                  <td>
                    <a [routerLink]="['/design', pkg.id]" class="btn btn-ghost btn-xs">View</a>
                    <a [routerLink]="['/design', pkg.id, 'edit']" class="btn btn-ghost btn-xs">Edit</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- Activity Feed -->
    <div class="mt-6">
      <app-activity-feed module="DesignPackage" title="Recent Activity" [limit]="5"></app-activity-feed>
    </div>
  `
})
export class DesignListComponent implements OnInit {
  allPackages: DesignPackageItem[] = [];
  filteredPackages: DesignPackageItem[] = [];
  loading = true;
  searchTerm = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<DesignPackageItem[]>>(`${environment.apiUrl}/design`).subscribe({
      next: (r) => { this.allPackages = r.data ?? []; this.filteredPackages = [...this.allPackages]; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  filterPackages(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPackages = this.allPackages.filter(p =>
      (p.name?.toLowerCase().includes(term)) ||
      (p.discipline?.toLowerCase().includes(term)) ||
      (p.consultant?.toLowerCase().includes(term)) ||
      (p.status?.toLowerCase().includes(term))
    );
  }

  exportCsv(): void {
    const headers = ['Name', 'Discipline', 'Consultant', 'Status', 'Version', 'Submitted', 'Approved'];
    const rows = this.filteredPackages.map(p => [
      p.name, p.discipline ?? '', p.consultant ?? '', p.status, p.version.toString(), p.submittedDate ?? '', p.approvedDate ?? ''
    ]);
    exportToCsv('design-packages', headers, rows);
  }
}
