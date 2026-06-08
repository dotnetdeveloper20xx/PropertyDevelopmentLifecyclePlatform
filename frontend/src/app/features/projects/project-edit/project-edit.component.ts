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
import { ApiResponse } from '../../../core/models/api-response.model';

interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  projectReference: string;
  projectManager: string | null;
  siteAddress: string | null;
  startDate: string | null;
  targetEndDate: string | null;
  budget: number | null;
  totalUnits: number | null;
  notes: string | null;
}

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading project..."></app-loading-state>
    } @else if (item) {
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Projects',url:'/projects'},{label:item.name,url:'/projects/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Project" [subtitle]="item.name">
        <a [routerLink]="['/projects', itemId]" class="btn btn-ghost btn-sm">← Back to Details</a>
      </app-page-header>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Project Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Project Name" fieldId="name" [required]="true"
                [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Name is required' : undefined">
                <input id="name" type="text" formControlName="name" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Project Reference" fieldId="projectReference" [required]="true">
                <input id="projectReference" type="text" formControlName="projectReference" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Project Manager" fieldId="projectManager">
                <input id="projectManager" type="text" formControlName="projectManager" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Site Address" fieldId="siteAddress">
                <input id="siteAddress" type="text" formControlName="siteAddress" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Timeline & Budget</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Start Date" fieldId="startDate">
                <input id="startDate" type="date" formControlName="startDate" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Target End Date" fieldId="targetEndDate">
                <input id="targetEndDate" type="date" formControlName="targetEndDate" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Budget (£)" fieldId="budget">
                <input id="budget" type="number" formControlName="budget" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Total Units" fieldId="totalUnits">
                <input id="totalUnits" type="number" formControlName="totalUnits" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Description & Notes</h3>
            <app-form-field label="Description" fieldId="description">
              <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>
            <app-form-field label="Notes" fieldId="notes">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/projects', itemId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Project Not Found</h3>
        <a routerLink="/projects" class="btn btn-primary btn-sm mt-4">Back to Projects</a>
      </div>
    }
  `
})
export class ProjectEditComponent implements OnInit {
  item: ProjectDetail | null = null;
  loading = true;
  saving = false;
  itemId = '';
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private fb: FormBuilder, private http: HttpClient,
    private toast: ToastService, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<ProjectDetail>>(`${environment.apiUrl}/projects/${this.itemId}`).subscribe({
      next: (r) => { this.item = r.data; this.buildForm(r.data); this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  private buildForm(p: ProjectDetail): void {
    this.form = this.fb.group({
      name: [p.name, Validators.required],
      projectReference: [p.projectReference, Validators.required],
      projectManager: [p.projectManager],
      siteAddress: [p.siteAddress],
      startDate: [p.startDate?.substring(0, 10)],
      targetEndDate: [p.targetEndDate?.substring(0, 10)],
      budget: [p.budget],
      totalUnits: [p.totalUnits],
      description: [p.description],
      notes: [p.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.put(`${environment.apiUrl}/projects/${this.itemId}`, this.form.value).subscribe({
      next: () => { this.toast.success('Project updated successfully'); this.router.navigate(['/projects', this.itemId]); },
      error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0] ?? 'Failed to update project'); this.cdr.markForCheck(); }
    });
  }
}
