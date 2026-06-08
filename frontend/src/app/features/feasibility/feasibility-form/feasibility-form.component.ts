import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Feasibility Assessment creation form.
 * Captures financial assumptions for a development appraisal.
 */
@Component({
  selector: 'app-feasibility-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Feasibility', url: '/feasibility' },
      { label: 'New Assessment' }
    ]"></app-breadcrumb>

    <app-page-header title="New Feasibility Assessment" subtitle="Capture cost assumptions and expected returns for a development appraisal">
      <a routerLink="/feasibility" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Assessment Identity -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Assessment Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Title" fieldId="title" [required]="true"
              helpTooltip="A descriptive title for this feasibility assessment"
              [error]="form.get('title')?.touched && form.get('title')?.hasError('required') ? 'Title is required' : undefined">
              <input id="title" type="text" formControlName="title" class="input input-bordered w-full"
                [class.input-error]="form.get('title')?.invalid && form.get('title')?.touched"
                placeholder="e.g., Riverside Development Feasibility" />
            </app-form-field>
            <div class="md:col-span-2">
              <app-form-field label="Description" fieldId="description"
                helpTooltip="Brief description of what this assessment covers">
                <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="2"
                  placeholder="e.g., 50-unit residential scheme on brownfield site"></textarea>
              </app-form-field>
            </div>
          </div>

          <!-- Cost Assumptions -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Cost Assumptions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Estimated Land Cost (£)" fieldId="estimatedLandCost" [required]="true"
              helpTooltip="Expected cost of land acquisition"
              [error]="form.get('estimatedLandCost')?.touched && form.get('estimatedLandCost')?.hasError('required') ? 'Land cost is required' : undefined">
              <input id="estimatedLandCost" type="number" formControlName="estimatedLandCost" class="input input-bordered w-full"
                [class.input-error]="form.get('estimatedLandCost')?.invalid && form.get('estimatedLandCost')?.touched"
                placeholder="e.g., 2000000" />
            </app-form-field>
            <app-form-field label="Estimated Build Cost (£)" fieldId="estimatedBuildCost" [required]="true"
              helpTooltip="Total construction cost estimate"
              [error]="form.get('estimatedBuildCost')?.touched && form.get('estimatedBuildCost')?.hasError('required') ? 'Build cost is required' : undefined">
              <input id="estimatedBuildCost" type="number" formControlName="estimatedBuildCost" class="input input-bordered w-full"
                [class.input-error]="form.get('estimatedBuildCost')?.invalid && form.get('estimatedBuildCost')?.touched"
                placeholder="e.g., 5000000" />
            </app-form-field>
            <app-form-field label="Professional Fees (£)" fieldId="professionalFees" [required]="true"
              helpTooltip="Fees for architects, engineers, surveyors, and consultants"
              [error]="form.get('professionalFees')?.touched && form.get('professionalFees')?.hasError('required') ? 'Professional fees is required' : undefined">
              <input id="professionalFees" type="number" formControlName="professionalFees" class="input input-bordered w-full"
                [class.input-error]="form.get('professionalFees')?.invalid && form.get('professionalFees')?.touched"
                placeholder="e.g., 500000" />
            </app-form-field>
            <app-form-field label="Finance Costs (£)" fieldId="financeCosts" [required]="true"
              helpTooltip="Interest and arrangement fees for development finance"
              [error]="form.get('financeCosts')?.touched && form.get('financeCosts')?.hasError('required') ? 'Finance costs is required' : undefined">
              <input id="financeCosts" type="number" formControlName="financeCosts" class="input input-bordered w-full"
                [class.input-error]="form.get('financeCosts')?.invalid && form.get('financeCosts')?.touched"
                placeholder="e.g., 300000" />
            </app-form-field>
          </div>

          <!-- Revenue Assumptions -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Revenue Assumptions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Gross Development Value (£)" fieldId="grossDevelopmentValue" [required]="true"
              helpTooltip="Total value of the completed development"
              [error]="form.get('grossDevelopmentValue')?.touched && form.get('grossDevelopmentValue')?.hasError('required') ? 'GDV is required' : undefined">
              <input id="grossDevelopmentValue" type="number" formControlName="grossDevelopmentValue" class="input input-bordered w-full"
                [class.input-error]="form.get('grossDevelopmentValue')?.invalid && form.get('grossDevelopmentValue')?.touched"
                placeholder="e.g., 12000000" />
            </app-form-field>
            <app-form-field label="Expected Revenue (£)" fieldId="expectedRevenue" [required]="true"
              helpTooltip="Expected total revenue from sales"
              [error]="form.get('expectedRevenue')?.touched && form.get('expectedRevenue')?.hasError('required') ? 'Expected revenue is required' : undefined">
              <input id="expectedRevenue" type="number" formControlName="expectedRevenue" class="input input-bordered w-full"
                [class.input-error]="form.get('expectedRevenue')?.invalid && form.get('expectedRevenue')?.touched"
                placeholder="e.g., 11000000" />
            </app-form-field>
          </div>

          <!-- Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
          <app-form-field label="Notes" fieldId="notes"
            helpTooltip="Any assumptions, caveats, or additional context">
            <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"
              placeholder="e.g., Assumes planning permission granted, no abnormals on site"></textarea>
          </app-form-field>

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/feasibility" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
              @if (!saving) { Create Assessment }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FeasibilityFormComponent {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      estimatedLandCost: [null, [Validators.required, Validators.min(0)]],
      estimatedBuildCost: [null, [Validators.required, Validators.min(0)]],
      professionalFees: [null, [Validators.required, Validators.min(0)]],
      financeCosts: [null, [Validators.required, Validators.min(0)]],
      grossDevelopmentValue: [null, [Validators.required, Validators.min(0)]],
      expectedRevenue: [null, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/feasibility`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Feasibility assessment created successfully');
        this.router.navigate(['/feasibility']);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to create assessment');
        this.cdr.markForCheck();
      }
    });
  }
}
