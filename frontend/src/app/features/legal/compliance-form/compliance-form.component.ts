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
 * Compliance Check creation form.
 * Allows users to create a new compliance check (AML, KYC, Title, etc.).
 */
@Component({
  selector: 'app-compliance-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Legal', url: '/legal' },
      { label: 'Compliance', url: '/legal/compliance' },
      { label: 'New Check' }
    ]"></app-breadcrumb>

    <app-page-header title="New Compliance Check" subtitle="Create a regulatory or legal compliance check">
      <a routerLink="/legal/compliance" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Check Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Check Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Check Type" fieldId="checkType" [required]="true"
              helpTooltip="The type of compliance check to perform"
              [error]="form.get('checkType')?.touched && form.get('checkType')?.hasError('required') ? 'Check type is required' : undefined">
              <select id="checkType" formControlName="checkType" class="select select-bordered w-full"
                [class.select-error]="form.get('checkType')?.invalid && form.get('checkType')?.touched">
                <option value="">Select check type</option>
                <option value="AML">AML (Anti Money Laundering)</option>
                <option value="KYC">KYC (Know Your Customer)</option>
                <option value="TitleVerification">Title Verification</option>
                <option value="LocalAuthority">Local Authority</option>
                <option value="Environmental">Environmental</option>
                <option value="Planning">Planning</option>
                <option value="Utilities">Utilities</option>
                <option value="Drainage">Drainage</option>
                <option value="HighwaySearch">Highway Search</option>
                <option value="Mining">Mining</option>
              </select>
            </app-form-field>
            <app-form-field label="Assigned To" fieldId="assignedTo"
              helpTooltip="Person responsible for completing this check">
              <input id="assignedTo" type="text" formControlName="assignedTo" class="input input-bordered w-full"
                placeholder="e.g., John Smith" />
            </app-form-field>
            <app-form-field label="Due Date" fieldId="dueDate"
              helpTooltip="Target completion date for this check">
              <input id="dueDate" type="date" formControlName="dueDate" class="input input-bordered w-full" />
            </app-form-field>
          </div>

          <!-- Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
          <app-form-field label="Notes" fieldId="notes"
            helpTooltip="Additional context, instructions, or observations">
            <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"
              placeholder="e.g., Priority check — required before exchange deadline"></textarea>
          </app-form-field>

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/legal/compliance" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
              @if (!saving) { Create Check }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ComplianceFormComponent {
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
      checkType: ['', Validators.required],
      assignedTo: [''],
      dueDate: [''],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/legal/compliance`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Compliance check created successfully');
        this.router.navigate(['/legal/compliance']);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to create compliance check');
        this.cdr.markForCheck();
      }
    });
  }
}
