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
 * Document upload/creation form.
 * Captures document metadata and file reference information.
 */
@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Documents', url: '/documents' },
      { label: 'Upload Document' }
    ]"></app-breadcrumb>

    <app-page-header title="Upload Document" subtitle="Register a new document with metadata and file reference">
      <a routerLink="/documents" class="btn btn-ghost btn-sm">← Back to List</a>
    </app-page-header>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Document Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Document Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Title" fieldId="title" [required]="true"
              helpTooltip="Document title for identification"
              [error]="form.get('title')?.touched && form.get('title')?.hasError('required') ? 'Title is required' : undefined">
              <input id="title" type="text" formControlName="title" class="input input-bordered w-full"
                [class.input-error]="form.get('title')?.invalid && form.get('title')?.touched"
                placeholder="e.g., Site Survey Report - Phase 1" />
            </app-form-field>
            <app-form-field label="Category" fieldId="category" [required]="true"
              helpTooltip="Document classification category"
              [error]="form.get('category')?.touched && form.get('category')?.hasError('required') ? 'Category is required' : undefined">
              <select id="category" formControlName="category" class="select select-bordered w-full"
                [class.select-error]="form.get('category')?.invalid && form.get('category')?.touched">
                <option value="">Select category</option>
                <option value="Contract">Contract</option>
                <option value="Planning">Planning</option>
                <option value="Legal">Legal</option>
                <option value="Financial">Financial</option>
                <option value="Construction">Construction</option>
                <option value="Sales">Sales</option>
                <option value="Compliance">Compliance</option>
                <option value="Template">Template</option>
                <option value="Report">Report</option>
                <option value="Other">Other</option>
              </select>
            </app-form-field>
            <div class="md:col-span-2">
              <app-form-field label="Description" fieldId="description"
                helpTooltip="Brief summary of the document contents">
                <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="2"
                  placeholder="e.g., Detailed topographical survey for the northern parcel"></textarea>
              </app-form-field>
            </div>
          </div>

          <!-- File Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">File Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="File Name" fieldId="fileName" [required]="true"
              helpTooltip="Name of the uploaded file including extension"
              [error]="form.get('fileName')?.touched && form.get('fileName')?.hasError('required') ? 'File name is required' : undefined">
              <input id="fileName" type="text" formControlName="fileName" class="input input-bordered w-full"
                [class.input-error]="form.get('fileName')?.invalid && form.get('fileName')?.touched"
                placeholder="e.g., site-survey-phase1.pdf" />
            </app-form-field>
            <app-form-field label="File Size (Bytes)" fieldId="fileSizeBytes" [required]="true"
              helpTooltip="Size of the file in bytes"
              [error]="form.get('fileSizeBytes')?.touched && form.get('fileSizeBytes')?.hasError('required') ? 'File size is required' : undefined">
              <input id="fileSizeBytes" type="number" formControlName="fileSizeBytes" class="input input-bordered w-full"
                [class.input-error]="form.get('fileSizeBytes')?.invalid && form.get('fileSizeBytes')?.touched"
                placeholder="e.g., 2048576" />
            </app-form-field>
            <div class="md:col-span-2">
              <app-form-field label="File Path" fieldId="filePath" [required]="true"
                helpTooltip="Storage path or URL where the file is located"
                [error]="form.get('filePath')?.touched && form.get('filePath')?.hasError('required') ? 'File path is required' : undefined">
                <input id="filePath" type="text" formControlName="filePath" class="input input-bordered w-full"
                  [class.input-error]="form.get('filePath')?.invalid && form.get('filePath')?.touched"
                  placeholder="e.g., /documents/surveys/site-survey-phase1.pdf" />
              </app-form-field>
            </div>
          </div>

          <!-- Tags -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Tags</h3>
          <app-form-field label="Tags" fieldId="tags"
            helpTooltip="Comma-separated tags for searchability (e.g., survey, phase1, topographical)">
            <input id="tags" type="text" formControlName="tags" class="input input-bordered w-full"
              placeholder="e.g., survey, phase1, topographical" />
          </app-form-field>

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/documents" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
              @if (!saving) { Upload Document }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DocumentFormComponent {
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
      category: ['', Validators.required],
      fileName: ['', Validators.required],
      filePath: ['', Validators.required],
      fileSizeBytes: [null, [Validators.required, Validators.min(1)]],
      tags: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const payload = {
      ...this.form.value,
      tags: this.form.value.tags
        ? this.form.value.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : []
    };
    this.http.post(`${environment.apiUrl}/documents`, payload).subscribe({
      next: () => {
        this.toastService.success('Document uploaded successfully');
        this.router.navigate(['/documents']);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to upload document');
        this.cdr.markForCheck();
      }
    });
  }
}
