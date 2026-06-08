import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ToastService } from '../../../core/services/toast.service';
import { FeasibilityItem } from '../../../core/models/feasibility.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Feasibility Assessment edit form.
 * Loads existing assessment data and allows modification of financial assumptions via PUT.
 */
@Component({
  selector: 'app-feasibility-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent,
    FormFieldComponent, LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading feasibility assessment..."></app-loading-state>
    } @else if (item) {
      <app-breadcrumb [items]="[
        { label: 'Home', url: '/dashboard' },
        { label: 'Feasibility', url: '/feasibility' },
        { label: item.title, url: '/feasibility/' + itemId },
        { label: 'Edit' }
      ]"></app-breadcrumb>

      <app-page-header title="Edit Feasibility Assessment" [subtitle]="item.title">
        <a [routerLink]="['/feasibility', itemId]" class="btn btn-ghost btn-sm">← Back to Details</a>
      </app-page-header>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- Assessment Details -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Assessment Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Title" fieldId="title" [required]="true"
                helpTooltip="A descriptive title for this feasibility assessment"
                [error]="form.get('title')?.touched && form.get('title')?.hasError('required') ? 'Title is required' : undefined">
                <input id="title" type="text" formControlName="title" class="input input-bordered w-full"
                  [class.input-error]="form.get('title')?.invalid && form.get('title')?.touched" />
              </app-form-field>
              <div class="md:col-span-2">
                <app-form-field label="Description" fieldId="description"
                  helpTooltip="Brief description of what this assessment covers">
                  <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="2"></textarea>
                </app-form-field>
              </div>
            </div>

            <!-- Cost Assumptions -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Cost Assumptions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Estimated Land Cost (£)" fieldId="estimatedLandCost"
                helpTooltip="Expected cost of land acquisition">
                <input id="estimatedLandCost" type="number" formControlName="estimatedLandCost" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Estimated Build Cost (£)" fieldId="estimatedBuildCost"
                helpTooltip="Total construction cost estimate">
                <input id="estimatedBuildCost" type="number" formControlName="estimatedBuildCost" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Professional Fees (£)" fieldId="professionalFees"
                helpTooltip="Fees for architects, engineers, surveyors, and consultants">
                <input id="professionalFees" type="number" formControlName="professionalFees" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Finance Costs (£)" fieldId="financeCosts"
                helpTooltip="Interest and arrangement fees for development finance">
                <input id="financeCosts" type="number" formControlName="financeCosts" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <!-- Revenue Assumptions -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Revenue Assumptions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Gross Development Value (£)" fieldId="grossDevelopmentValue"
                helpTooltip="Total value of the completed development">
                <input id="grossDevelopmentValue" type="number" formControlName="grossDevelopmentValue" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Expected Revenue (£)" fieldId="expectedRevenue"
                helpTooltip="Expected total revenue from sales">
                <input id="expectedRevenue" type="number" formControlName="expectedRevenue" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <!-- Notes -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Any assumptions, caveats, or additional context">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/feasibility', itemId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Assessment Not Found</h3>
        <p class="text-base-content/60 mt-2">The requested feasibility assessment could not be located.</p>
        <a routerLink="/feasibility" class="btn btn-primary btn-sm mt-4">Back to Feasibility</a>
      </div>
    }
  `
})
export class FeasibilityEditComponent implements OnInit {
  item: FeasibilityItem | null = null;
  loading = true;
  saving = false;
  itemId = '';
  form!: FormGroup;

  private readonly apiUrl = `${environment.apiUrl}/feasibility`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.itemId) {
      this.http.get<ApiResponse<FeasibilityItem[]>>(this.apiUrl).subscribe({
        next: (response) => {
          this.item = response.data.find(f => f.id === this.itemId) ?? null;
          if (this.item) {
            this.buildForm(this.item);
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loading = false;
    }
  }

  private buildForm(assessment: FeasibilityItem): void {
    this.form = this.fb.group({
      title: [assessment.title, Validators.required],
      description: [assessment.description],
      estimatedLandCost: [assessment.estimatedLandCost],
      estimatedBuildCost: [assessment.estimatedBuildCost],
      professionalFees: [assessment.professionalFees],
      financeCosts: [assessment.financeCosts],
      grossDevelopmentValue: [assessment.grossDevelopmentValue],
      expectedRevenue: [assessment.expectedRevenue],
      notes: [assessment.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.put(`${this.apiUrl}/${this.itemId}`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Feasibility assessment updated successfully');
        this.router.navigate(['/feasibility', this.itemId]);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to update assessment');
        this.cdr.markForCheck();
      }
    });
  }
}
