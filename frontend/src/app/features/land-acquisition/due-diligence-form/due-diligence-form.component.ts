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
 * Due Diligence creation form.
 * Captures due diligence check type, findings, and associated opportunity.
 */
@Component({
  selector: 'app-due-diligence-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Due Diligence', url: '/due-diligence' },
      { label: 'New Check' }
    ]"></app-breadcrumb>

    <app-page-header title="New Due Diligence Check" subtitle="Record a due diligence check against a land opportunity">
      <a routerLink="/due-diligence" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Check Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Check Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Opportunity ID" fieldId="opportunityId" [required]="true"
              helpTooltip="The land opportunity this check relates to"
              [error]="form.get('opportunityId')?.touched && form.get('opportunityId')?.hasError('required') ? 'Opportunity ID is required' : undefined">
              <input id="opportunityId" type="text" formControlName="opportunityId" class="input input-bordered w-full"
                [class.input-error]="form.get('opportunityId')?.invalid && form.get('opportunityId')?.touched"
                placeholder="e.g., paste the opportunity GUID" />
            </app-form-field>
            <app-form-field label="Type" fieldId="type" [required]="true"
              helpTooltip="Category of due diligence check"
              [error]="form.get('type')?.touched && form.get('type')?.hasError('required') ? 'Type is required' : undefined">
              <select id="type" formControlName="type" class="select select-bordered w-full"
                [class.select-error]="form.get('type')?.invalid && form.get('type')?.touched">
                <option value="">Select check type</option>
                <option value="Legal">Legal</option>
                <option value="Environmental">Environmental</option>
                <option value="Planning">Planning</option>
                <option value="Utilities">Utilities</option>
                <option value="Valuation">Valuation</option>
              </select>
            </app-form-field>
          </div>

          <!-- Findings -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Findings</h3>
          <div class="mb-6">
            <app-form-field label="Findings" fieldId="findings"
              helpTooltip="Summary of findings from this check">
              <textarea id="findings" formControlName="findings" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Title search confirmed freehold ownership with no encumbrances"></textarea>
            </app-form-field>
          </div>

          <!-- Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
          <app-form-field label="Notes" fieldId="notes"
            helpTooltip="Additional observations or follow-up actions">
            <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"
              placeholder="e.g., Awaiting further environmental report from consultant"></textarea>
          </app-form-field>

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/due-diligence" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
              @if (!saving) { Create Check }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DueDiligenceFormComponent {
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
      opportunityId: ['', Validators.required],
      type: ['', Validators.required],
      findings: [''],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/due-diligence`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Due diligence check created successfully');
        this.router.navigate(['/due-diligence']);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to create due diligence check');
        this.cdr.markForCheck();
      }
    });
  }
}
