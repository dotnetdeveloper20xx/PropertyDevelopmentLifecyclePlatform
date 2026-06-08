import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { DueDiligenceService, DueDiligenceListItem } from '../../../core/services/due-diligence.service';

@Component({
  selector: 'app-due-diligence-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Land Acquisition' },
      { label: 'Due Diligence' }
    ]"></app-breadcrumb>

    <app-page-header title="Due Diligence Checks" subtitle="Review legal, environmental, and planning assessments across opportunities">
    </app-page-header>

    <app-page-description
      description="Due diligence checks are critical assessments performed on land opportunities before acquisition. They cover legal title searches, environmental reports, planning potential, utilities availability, and financial valuations."
      guidance="Enter an opportunity ID below to load the due diligence checks for that opportunity. Each check tracks its type, status, risk level, and assigned reviewer."
      helpLink="/help/land-acquisition/la-due-diligence"
    ></app-page-description>

    <!-- Opportunity ID Input -->
    <div class="card bg-base-100 border border-base-300 p-4 mb-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="form-control flex-1 min-w-[250px]">
          <label class="label" for="opportunityIdInput">
            <span class="label-text font-medium">Opportunity ID</span>
          </label>
          <input
            id="opportunityIdInput"
            type="text"
            class="input input-bordered input-sm w-full"
            placeholder="Enter opportunity ID to load due diligence checks..."
            [(ngModel)]="opportunityId"
            (keydown.enter)="loadChecks()"
            aria-label="Opportunity ID"
          />
        </div>
        <button class="btn btn-primary btn-sm" [disabled]="!opportunityId" (click)="loadChecks()">
          Load Checks
        </button>
      </div>
    </div>

    @if (loading) {
      <app-loading-state message="Loading due diligence checks..."></app-loading-state>
    } @else if (!checksLoaded) {
      <app-empty-state
        title="Select an Opportunity"
        message="Enter an opportunity ID above and click Load to view its due diligence checks. Due diligence assessments help evaluate risk before acquisition.">
      </app-empty-state>
    } @else if (checks.length === 0) {
      <app-empty-state
        title="No Due Diligence Checks"
        message="No due diligence checks have been recorded for this opportunity yet. Navigate to the opportunity detail page to create checks.">
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Due diligence checks">
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Assigned To</th>
                <th>Report Date</th>
              </tr>
            </thead>
            <tbody>
              @for (check of checks; track check.id) {
                <tr class="hover">
                  <td class="font-medium">{{ check.type }}</td>
                  <td><app-status-badge [status]="check.status"></app-status-badge></td>
                  <td>
                    @if (check.riskLevel) {
                      <span class="badge badge-sm" [class]="getRiskBadgeClass(check.riskLevel)">
                        {{ check.riskLevel }}
                      </span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td>{{ check.assignedTo || '—' }}</td>
                  <td class="text-sm">{{ check.reportDate ? (check.reportDate | date:'mediumDate') : '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class DueDiligenceListComponent {
  opportunityId = '';
  checks: DueDiligenceListItem[] = [];
  loading = false;
  checksLoaded = false;

  constructor(private dueDiligenceService: DueDiligenceService) {}

  loadChecks(): void {
    if (!this.opportunityId) return;
    this.loading = true;
    this.checksLoaded = false;

    this.dueDiligenceService.getByOpportunity(this.opportunityId).subscribe({
      next: (response) => {
        this.checks = response.data ?? [];
        this.loading = false;
        this.checksLoaded = true;
      },
      error: () => {
        this.checks = [];
        this.loading = false;
        this.checksLoaded = true;
      }
    });
  }

  getRiskBadgeClass(riskLevel: string): string {
    switch (riskLevel) {
      case 'Critical': return 'badge-error';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      case 'Low': return 'badge-success';
      default: return 'badge-ghost';
    }
  }
}
