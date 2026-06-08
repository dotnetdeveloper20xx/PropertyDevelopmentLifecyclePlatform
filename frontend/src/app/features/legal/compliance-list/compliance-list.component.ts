import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ComplianceCheckItem } from '../../../core/models/legal.model';
import * as LegalActions from '../store/legal.actions';
import * as LegalSelectors from '../store/legal.selectors';

@Component({
  selector: 'app-compliance-list',
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
      { label: 'Legal & Compliance' },
      { label: 'Compliance' }
    ]"></app-breadcrumb>

    <app-page-header title="Compliance Checks" subtitle="Track regulatory and legal compliance across your opportunities">
    </app-page-header>

    <app-page-description
      description="Compliance checks ensure that every land opportunity meets Anti-Money Laundering (AML), Know Your Customer (KYC), title verification, local authority, environmental, planning, utilities, drainage, highway search, and mining requirements before acquisition proceeds."
      guidance="Enter an opportunity ID below to load compliance checks for that opportunity. Each check tracks type, status, risk level, and assigned officer. Compliance checks are typically managed by the Legal & Compliance Officer."
      helpLink="/help/legal/compliance-overview"
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
            placeholder="Enter opportunity ID to load compliance checks..."
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

    @if (loading$ | async) {
      <app-loading-state message="Loading compliance checks..."></app-loading-state>
    } @else if (!checksLoaded) {
      <app-empty-state
        title="Select an Opportunity"
        message="Enter an opportunity ID above and click Load to view its compliance checks. Compliance assessments ensure regulatory requirements are met before acquisition.">
      </app-empty-state>
    } @else if ((checks$ | async)?.length === 0) {
      <app-empty-state
        title="No Compliance Checks"
        message="No compliance checks have been created for this opportunity yet. Navigate to the opportunity detail page or use the Legal module to create compliance checks.">
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Compliance checks">
            <thead>
              <tr>
                <th>Check Type</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              @for (check of checks$ | async; track check.id) {
                <tr class="hover">
                  <td class="font-medium">{{ formatCheckType(check.checkType) }}</td>
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
                  <td class="text-sm">{{ check.dueDate ? (check.dueDate | date:'mediumDate') : '—' }}</td>
                  <td class="text-sm">{{ check.completedDate ? (check.completedDate | date:'mediumDate') : '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class ComplianceListComponent {
  checks$: Observable<ComplianceCheckItem[]>;
  loading$: Observable<boolean>;

  opportunityId = '';
  checksLoaded = false;

  constructor(private store: Store) {
    this.checks$ = this.store.select(LegalSelectors.selectComplianceChecks);
    this.loading$ = this.store.select(LegalSelectors.selectComplianceLoading);
  }

  loadChecks(): void {
    if (!this.opportunityId) return;
    this.checksLoaded = true;
    this.store.dispatch(LegalActions.loadCompliance({ opportunityId: this.opportunityId }));
  }

  formatCheckType(type: string): string {
    switch (type) {
      case 'AML': return 'Anti-Money Laundering';
      case 'KYC': return 'Know Your Customer';
      case 'TitleVerification': return 'Title Verification';
      case 'LocalAuthority': return 'Local Authority';
      case 'HighwaySearch': return 'Highway Search';
      default: return type;
    }
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
