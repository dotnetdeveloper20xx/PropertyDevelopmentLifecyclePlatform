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
 * Report creation form.
 * Allows users to define a new report with title, description, and type.
 */
@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Reports', url: '/reports' },
      { label: 'Create Report' }
    ]"></app-breadcrumb>

    <app-page-header title="Create Report" subtitle="Define a new report for financial, construction, or executive stakeholders">
      <a routerLink="/reports" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Report Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Report Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Title" fieldId="title" [required]="true"
              helpTooltip="Title of the report"
              [error]="form.get('title')?.touched && form.get('title')?.hasError('required') ? 'Title is required' : undefined">
              <input id="title" type="text" formControlName="title" class="input input-bordered w-full"
                [class.input-error]="form.get('title')?.invalid && form.get('title')?.touched"
                placeholder="e.g., Q4 2024 Financial Summary" />
            </app-form-field>
            <app-form-field label="Report Type" fieldId="reportType" [required]="true"
              helpTooltip="Category of report"
              [error]="form.get('reportType')?.touched && form.get('reportType')?.hasError('required') ? 'Report type is required' : undefined">
              <select id="reportType" formControlName="reportType" class="select select-bordered w-full"
                [class.select-error]="form.get('reportType')?.invalid && form.get('reportType')?.touched">
                <option value="">Select report type</option>
                <option value="Financial">Financial</option>
                <option value="Construction">Construction</option>
                <option value="Sales">Sales</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Compliance">Compliance</option>
                <option value="Executive">Executive</option>
              </select>
            </app-form-field>
          </div>

          <!-- Description -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Description</h3>
          <app-form-field label="Description" fieldId="description"
            helpTooltip="Brief summary of the report purpose and scope">
            <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="4"
              placeholder="e.g., Comprehensive financial report covering all active projects for Q4 2024, including budget variance analysis and cash flow forecasts"></textarea>
          </app-form-field>

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/reports" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
              @if (!saving) { Create Report }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ReportFormComponent {
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
      reportType: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/reports`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Report created successfully');
        this.router.navigate(['/reports']);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to create report');
        this.cdr.markForCheck();
      }
    });
  }
}
