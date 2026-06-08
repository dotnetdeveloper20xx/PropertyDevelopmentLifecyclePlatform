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
 * Design Package creation form.
 * Captures design discipline, consultant, and description for a new package.
 */
@Component({
  selector: 'app-design-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Design', url: '/design' },
      { label: 'New Package' }
    ]"></app-breadcrumb>

    <app-page-header title="New Design Package" subtitle="Create a new design package for architectural or engineering deliverables">
      <a routerLink="/design" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Package Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Package Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Name" fieldId="name" [required]="true"
              helpTooltip="Name of the design package (e.g., Structural Design Stage 3)"
              [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Name is required' : undefined">
              <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g., Structural Design Stage 3" />
            </app-form-field>
            <app-form-field label="Discipline" fieldId="discipline"
              helpTooltip="Design discipline (e.g., Architecture, Structural, MEP, Landscape)">
              <input id="discipline" type="text" formControlName="discipline" class="input input-bordered w-full"
                placeholder="e.g., Architecture" />
            </app-form-field>
            <app-form-field label="Consultant" fieldId="consultant"
              helpTooltip="Name of the consultant or firm responsible">
              <input id="consultant" type="text" formControlName="consultant" class="input input-bordered w-full"
                placeholder="e.g., Smith & Partners Architects" />
            </app-form-field>
          </div>

          <!-- Description -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Description</h3>
          <div class="mb-6">
            <app-form-field label="Description" fieldId="description"
              helpTooltip="Detailed description of deliverables and scope">
              <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"
                placeholder="e.g., Full structural design package including foundation details, frame design, and roof structure"></textarea>
            </app-form-field>
          </div>

          <!-- Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
          <app-form-field label="Notes" fieldId="notes"
            helpTooltip="Additional notes or comments">
            <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"
              placeholder="e.g., Pending geotechnical report before finalising foundation design"></textarea>
          </app-form-field>

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/design" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
              @if (!saving) { Create Package }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DesignFormComponent {
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
      name: ['', Validators.required],
      description: [''],
      discipline: [''],
      consultant: [''],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/design`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Design package created successfully');
        this.router.navigate(['/design']);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to create design package');
        this.cdr.markForCheck();
      }
    });
  }
}
