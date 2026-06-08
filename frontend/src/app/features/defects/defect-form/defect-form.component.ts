import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-defect-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Defects',url:'/defects'},{label:'Report Defect'}]"></app-breadcrumb>
    <app-page-header title="Report Defect" subtitle="Log a new defect or snagging issue">
      <a routerLink="/defects" class="btn btn-ghost btn-sm">← Back to Defects</a>
    </app-page-header>
    <app-page-description description="Report a defect found during inspection or post-completion. Assign priority and responsible party for resolution tracking." guidance="Title and Priority are required. Provide location details for faster resolution."></app-page-description>
    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Title" fieldId="title" [required]="true" [error]="form.get('title')?.touched && form.get('title')?.hasError('required') ? 'Title is required' : undefined">
              <input id="title" type="text" formControlName="title" class="input input-bordered w-full" placeholder="e.g., Cracked tile in bathroom" />
            </app-form-field>
            <app-form-field label="Priority" fieldId="priority" [required]="true" [error]="form.get('priority')?.touched && form.get('priority')?.hasError('required') ? 'Priority is required' : undefined">
              <select id="priority" formControlName="priority" class="select select-bordered w-full">
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </app-form-field>
            <app-form-field label="Location" fieldId="location"><input id="location" type="text" formControlName="location" class="input input-bordered w-full" placeholder="e.g., Unit 4B, Kitchen" /></app-form-field>
            <app-form-field label="Unit Reference" fieldId="unitReference"><input id="unitReference" type="text" formControlName="unitReference" class="input input-bordered w-full" /></app-form-field>
            <app-form-field label="Assigned To" fieldId="assignedTo"><input id="assignedTo" type="text" formControlName="assignedTo" class="input input-bordered w-full" /></app-form-field>
          </div>
          <app-form-field label="Description" fieldId="description"><textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"></textarea></app-form-field>
          <app-form-field label="Notes" fieldId="notes"><textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea></app-form-field>
          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/defects" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">@if(!saving){Report Defect}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DefectFormComponent {
  form: FormGroup;
  saving = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({ title: ['', Validators.required], priority: ['', Validators.required], location: [''], unitReference: [''], assignedTo: [''], description: [''], notes: [''] });
  }
  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/defects`, this.form.value).subscribe({ next: () => { this.toast.success('Defect reported successfully'); this.router.navigate(['/defects']); }, error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0] ?? 'Failed to report defect'); } });
  }
}
