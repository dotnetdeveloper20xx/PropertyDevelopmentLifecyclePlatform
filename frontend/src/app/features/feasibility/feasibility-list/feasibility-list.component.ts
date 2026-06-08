import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { FeasibilityItem, CreateFeasibilityRequest } from '../../../core/models/feasibility.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as FeasibilityActions from '../store/feasibility.actions';
import * as FeasibilitySelectors from '../store/feasibility.selectors';

@Component({
  selector: 'app-feasibility-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Feasibility & Viability'}, {label: 'Assessments'}]"></app-breadcrumb>
    <app-page-header title="Feasibility Assessments" subtitle="Evaluate financial viability of land opportunities before acquisition decisions">
    </app-page-header>
    <app-page-description
      description="Feasibility assessments calculate whether a land opportunity is financially viable. Each assessment models estimated costs (land, build, fees, finance) against expected revenue to determine profit and ROI. Use these to support investment committee decisions."
      guidance="Enter an Opportunity ID below to load feasibility assessments for that opportunity. Create new assessments to model different cost and revenue scenarios."
      helpLink="/help/feasibility/feasibility-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

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
            placeholder="Enter opportunity ID to load feasibility assessments..."
            [(ngModel)]="opportunityId"
            (keydown.enter)="loadAssessments()"
          />
        </div>
        <button class="btn btn-primary btn-sm" [disabled]="!opportunityId" (click)="loadAssessments()">
          Load Assessments
        </button>
      </div>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading feasibility assessments..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadAssessments()"></app-error-state>
    } @else if (!opportunityId || !assessmentsLoaded) {
      <app-empty-state
        title="Select an Opportunity"
        message="Enter a land opportunity ID above and click Load to view feasibility assessments for that opportunity.">
      </app-empty-state>
    } @else if (assessmentsLoaded && (assessments$ | async)?.length === 0) {
      <app-empty-state
        title="No Feasibility Assessments"
        message="No feasibility assessments have been created for this opportunity yet. Add your first assessment below to evaluate the financial viability of this land opportunity.">
      </app-empty-state>
    } @else if ((assessments$ | async)?.length) {
      <div class="card bg-base-100 shadow-sm border border-base-300 mb-4">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Feasibility assessments">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Land Cost</th>
                <th>Build Cost</th>
                <th>Total Costs</th>
                <th>Expected Revenue</th>
                <th>Profit</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              @for (item of assessments$ | async; track item.id) {
                <tr class="hover">
                  <td class="font-medium">{{ item.title }}</td>
                  <td><app-status-badge [status]="item.status"></app-status-badge></td>
                  <td class="font-mono text-sm">£{{ item.estimatedLandCost | number:'1.0-0' }}</td>
                  <td class="font-mono text-sm">£{{ item.estimatedBuildCost | number:'1.0-0' }}</td>
                  <td class="font-mono text-sm">£{{ totalCosts(item) | number:'1.0-0' }}</td>
                  <td class="font-mono text-sm">£{{ item.expectedRevenue | number:'1.0-0' }}</td>
                  <td class="font-mono text-sm" [ngClass]="{'text-success': item.estimatedProfit > 0, 'text-error': item.estimatedProfit <= 0}">
                    £{{ item.estimatedProfit | number:'1.0-0' }}
                  </td>
                  <td>
                    <span class="badge badge-sm" [ngClass]="{
                      'badge-success': item.roi >= 20,
                      'badge-warning': item.roi >= 10 && item.roi < 20,
                      'badge-error': item.roi < 10
                    }">{{ item.roi | number:'1.1-1' }}%</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- Add Assessment Form -->
    @if (opportunityId && assessmentsLoaded) {
      <div class="card bg-base-100 border border-base-300 p-4">
        <h3 class="font-semibold text-sm mb-3">Add Feasibility Assessment</h3>
        <form [formGroup]="assessmentForm" (ngSubmit)="onCreateAssessment()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Title *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="title"
              placeholder="e.g. Base Case Scenario" />
            @if (assessmentForm.get('title')?.touched && assessmentForm.get('title')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Title is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Estimated Land Cost (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="estimatedLandCost"
              placeholder="e.g. 2000000" min="0" step="0.01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Estimated Build Cost (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="estimatedBuildCost"
              placeholder="e.g. 8000000" min="0" step="0.01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Professional Fees (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="professionalFees"
              placeholder="e.g. 500000" min="0" step="0.01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Finance Costs (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="financeCosts"
              placeholder="e.g. 300000" min="0" step="0.01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Gross Development Value (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="grossDevelopmentValue"
              placeholder="e.g. 15000000" min="0" step="0.01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Expected Revenue (£) *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="expectedRevenue"
              placeholder="e.g. 14000000" min="0" step="0.01" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="assessmentForm.invalid">Create Assessment</button>
          </div>
        </form>
      </div>
    }
  `
})
export class FeasibilityListComponent implements OnInit {
  assessments$: Observable<FeasibilityItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  opportunityId = '';
  assessmentsLoaded = false;

  assessmentForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    estimatedLandCost: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    estimatedBuildCost: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    professionalFees: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    financeCosts: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    grossDevelopmentValue: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    expectedRevenue: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.assessments$ = this.store.select(FeasibilitySelectors.selectAssessments);
    this.loading$ = this.store.select(FeasibilitySelectors.selectFeasibilityLoading);
    this.error$ = this.store.select(FeasibilitySelectors.selectFeasibilityError);
  }

  ngOnInit(): void {
    const queryOppId = this.route.snapshot.queryParamMap.get('opportunityId');
    if (queryOppId) {
      this.opportunityId = queryOppId;
      this.loadAssessments();
    }
  }

  loadAssessments(): void {
    if (!this.opportunityId) return;
    this.assessmentsLoaded = true;
    this.store.dispatch(FeasibilityActions.loadFeasibility({ opportunityId: this.opportunityId }));
  }

  totalCosts(item: FeasibilityItem): number {
    return item.estimatedLandCost + item.estimatedBuildCost + item.professionalFees + item.financeCosts;
  }

  exportCsv(): void {
    this.assessments$.subscribe(assessments => {
      const headers = ['Title', 'Status', 'Land Cost', 'Build Cost', 'Prof. Fees', 'Finance Costs', 'GDV', 'Revenue', 'Profit', 'ROI %'];
      const rows = assessments.map(a => [
        a.title,
        a.status,
        a.estimatedLandCost.toString(),
        a.estimatedBuildCost.toString(),
        a.professionalFees.toString(),
        a.financeCosts.toString(),
        a.grossDevelopmentValue.toString(),
        a.expectedRevenue.toString(),
        a.estimatedProfit.toString(),
        a.roi.toString()
      ]);
      exportToCsv('feasibility-assessments', headers, rows);
    }).unsubscribe();
  }

  onCreateAssessment(): void {
    if (this.assessmentForm.invalid || !this.opportunityId) return;

    const formValue = this.assessmentForm.getRawValue();
    const request: CreateFeasibilityRequest = {
      title: formValue.title,
      description: formValue.description || undefined,
      estimatedLandCost: formValue.estimatedLandCost ?? 0,
      estimatedBuildCost: formValue.estimatedBuildCost ?? 0,
      professionalFees: formValue.professionalFees ?? 0,
      financeCosts: formValue.financeCosts ?? 0,
      grossDevelopmentValue: formValue.grossDevelopmentValue ?? 0,
      expectedRevenue: formValue.expectedRevenue ?? 0,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(FeasibilityActions.createFeasibility({
      opportunityId: this.opportunityId,
      request
    }));
    this.assessmentForm.reset();
  }
}
