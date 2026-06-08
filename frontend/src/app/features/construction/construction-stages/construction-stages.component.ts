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
import { ConstructionStageItem } from '../../../core/models/construction.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-construction-stages',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ActivityFeedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Design & Construction' },
      { label: 'Stages' }
    ]"></app-breadcrumb>

    <app-page-header title="Construction Stages" subtitle="Track construction progress across all project stages, inspections, and snagging">
    </app-page-header>

    <app-page-description
      description="Construction stages represent the major phases of building work for a project. Each stage tracks its planned and actual dates, progress percentage, inspections carried out, and any snags identified during construction."
      guidance="All construction stages are shown below. Use the search to filter, or click View/Edit to manage individual stages."
      helpLink="/help/construction/stages-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <input type="text" class="input input-bordered input-sm w-64" placeholder="Search stages..." [(ngModel)]="searchTerm" (ngModelChange)="filterStages()" />
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
      <a routerLink="/construction/new" class="btn btn-primary btn-sm">+ Add Stage</a>
    </div>

    @if (loading) {
      <app-loading-state message="Loading construction stages..."></app-loading-state>
    } @else if (filteredStages.length === 0) {
      <app-empty-state
        title="No Construction Stages"
        message="No construction stages found. Create your first stage to begin tracking construction progress.">
      </app-empty-state>
    } @else {
      <!-- Stages Table -->
      <div class="card bg-base-100 shadow-sm border border-base-300 mb-4">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Construction stages">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Planned Start</th>
                <th>Planned End</th>
                <th>Inspections</th>
                <th>Snags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (stage of filteredStages; track stage.id) {
                <tr class="hover">
                  <td class="font-medium">{{ stage.name }}</td>
                  <td><app-status-badge [status]="stage.status"></app-status-badge></td>
                  <td>
                    @if (stage.progressPercent !== null) {
                      <div class="flex items-center gap-2">
                        <progress class="progress progress-primary w-16" [value]="stage.progressPercent" max="100"></progress>
                        <span class="text-xs">{{ stage.progressPercent }}%</span>
                      </div>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td class="text-sm">{{ stage.plannedStartDate ? (stage.plannedStartDate | date:'mediumDate') : '—' }}</td>
                  <td class="text-sm">{{ stage.plannedEndDate ? (stage.plannedEndDate | date:'mediumDate') : '—' }}</td>
                  <td>
                    @if (stage.inspectionCount > 0) {
                      <span class="badge badge-sm badge-outline">{{ stage.inspectionCount }}</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td>
                    @if (stage.snagCount > 0) {
                      <span class="badge badge-sm badge-warning badge-outline">{{ stage.snagCount }}</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td>
                    <a [routerLink]="['/construction', stage.id]" class="btn btn-ghost btn-xs">View</a>
                    <a [routerLink]="['/construction', stage.id, 'edit']" class="btn btn-ghost btn-xs">Edit</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class ConstructionStagesComponent implements OnInit {
  allStages: ConstructionStageItem[] = [];
  filteredStages: ConstructionStageItem[] = [];
  loading = true;
  searchTerm = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<ConstructionStageItem[]>>(`${environment.apiUrl}/construction`).subscribe({
      next: (r) => { this.allStages = r.data ?? []; this.filteredStages = [...this.allStages]; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  filterStages(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStages = this.allStages.filter(s =>
      s.name.toLowerCase().includes(term) || s.status.toLowerCase().includes(term)
    );
  }

  exportCsv(): void {
    const headers = ['Name', 'Status', 'Progress %', 'Planned Start', 'Planned End', 'Inspections', 'Snags'];
    const rows = this.filteredStages.map(s => [
      s.name, s.status, s.progressPercent?.toString() ?? '', s.plannedStartDate ?? '', s.plannedEndDate ?? '',
      s.inspectionCount.toString(), s.snagCount.toString()
    ]);
    exportToCsv('construction-stages', headers, rows);
  }
}
