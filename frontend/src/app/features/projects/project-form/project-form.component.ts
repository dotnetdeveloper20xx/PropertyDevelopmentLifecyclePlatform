import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { FormProgressComponent, FormStep } from '../../../shared/components/form-progress/form-progress.component';
import * as ProjectsActions from '../store/projects.actions';
import * as ProjectsSelectors from '../store/projects.selectors';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    FormFieldComponent, FormProgressComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Project Management', url: '/projects'}, {label: 'Projects', url: '/projects'}, {label: 'Create Project'}]"></app-breadcrumb>
    <app-page-header title="Create Project" subtitle="Create a new development project linked to a land opportunity">
      <a routerLink="/projects" class="btn btn-ghost btn-sm">← Back to Projects</a>
    </app-page-header>
    <app-page-description
      description="Define the project details including the linked opportunity, budget, schedule, and team. Projects are the primary vehicle for tracking development progress from planning through to completion."
      guidance="Opportunity ID, Project Name, and Project Reference are required. Schedule and budget details can be updated as the project progresses."
      helpLink="/help/projects/creating-projects"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Project Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Project Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Opportunity ID" fieldId="opportunityId" [required]="true"
              helpTooltip="The acquired land opportunity this project is based on"
              [error]="form.get('opportunityId')?.touched && form.get('opportunityId')?.hasError('required') ? 'Please enter the opportunity ID' : undefined">
              <input id="opportunityId" type="text" formControlName="opportunityId" class="input input-bordered w-full"
                [class.input-error]="form.get('opportunityId')?.invalid && form.get('opportunityId')?.touched"
                placeholder="e.g., paste the opportunity GUID" />
            </app-form-field>

            <app-form-field label="Project Name" fieldId="name" [required]="true"
              helpTooltip="A descriptive name for the development project"
              [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Please enter a project name' : undefined">
              <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g., Riverside Apartments Development" />
            </app-form-field>

            <app-form-field label="Project Reference" fieldId="projectReference" [required]="true"
              helpTooltip="Unique reference number for this project (e.g., PRJ/2024/001)"
              [error]="form.get('projectReference')?.touched && form.get('projectReference')?.hasError('required') ? 'Please enter a project reference' : undefined">
              <input id="projectReference" type="text" formControlName="projectReference" class="input input-bordered w-full"
                [class.input-error]="form.get('projectReference')?.invalid && form.get('projectReference')?.touched"
                placeholder="e.g., PRJ/2024/001" />
            </app-form-field>

            <app-form-field label="Project Manager" fieldId="projectManager"
              helpTooltip="The person responsible for delivering this project">
              <input id="projectManager" type="text" formControlName="projectManager" class="input input-bordered w-full"
                placeholder="e.g., John Smith" />
            </app-form-field>

            <app-form-field label="Description" fieldId="description"
              helpTooltip="Brief description of the project scope and objectives">
              <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"
                placeholder="e.g., Development of 48 residential units including 12 affordable homes."></textarea>
            </app-form-field>

            <app-form-field label="Site Address" fieldId="siteAddress"
              helpTooltip="The physical address of the development site">
              <input id="siteAddress" type="text" formControlName="siteAddress" class="input input-bordered w-full"
                placeholder="e.g., 123 Riverside Road, London, SE1 7PB" />
            </app-form-field>
          </div>

          <!-- Step 2: Schedule & Budget -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Schedule & Budget
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Start Date" fieldId="startDate"
              helpTooltip="Planned project start date">
              <input id="startDate" type="date" formControlName="startDate" class="input input-bordered w-full" />
            </app-form-field>

            <app-form-field label="Target End Date" fieldId="targetEndDate"
              helpTooltip="Expected project completion date">
              <input id="targetEndDate" type="date" formControlName="targetEndDate" class="input input-bordered w-full" />
            </app-form-field>

            <app-form-field label="Budget (£)" fieldId="budget"
              helpTooltip="Total approved project budget">
              <input id="budget" type="number" formControlName="budget" class="input input-bordered w-full"
                step="0.01" placeholder="e.g., 5000000.00" />
            </app-form-field>

            <app-form-field label="Total Units" fieldId="totalUnits"
              helpTooltip="Total number of units planned for this development">
              <input id="totalUnits" type="number" formControlName="totalUnits" class="input input-bordered w-full"
                placeholder="e.g., 48" />
            </app-form-field>
          </div>

          <!-- Step 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Internal notes or additional context about this project">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Planning permission granted with conditions. Awaiting discharge of conditions before construction can commence."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/projects" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Project }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProjectFormComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store, private route: ActivatedRoute) {
    this.form = this.fb.group({
      opportunityId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      projectReference: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      projectManager: [''],
      siteAddress: [''],
      startDate: [''],
      targetEndDate: [''],
      budget: [null],
      totalUnits: [null],
      notes: ['']
    });
    this.loading$ = this.store.select(ProjectsSelectors.selectProjectsLoading);
    this.error$ = this.store.select(ProjectsSelectors.selectProjectsError);
  }

  ngOnInit(): void {
    const opportunityId = this.route.snapshot.queryParamMap.get('opportunityId');
    if (opportunityId) {
      this.form.patchValue({ opportunityId });
    }
  }

  formSteps(): FormStep[] {
    const detailsValid = !!this.form?.get('opportunityId')?.valid &&
      !!this.form?.get('name')?.valid &&
      !!this.form?.get('projectReference')?.valid;
    const scheduleValid = !!this.form?.get('startDate')?.value || !!this.form?.get('targetEndDate')?.value ||
      !!this.form?.get('budget')?.value || !!this.form?.get('totalUnits')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Project Details', completed: detailsValid, active: !detailsValid },
      { label: 'Schedule & Budget', completed: scheduleValid, active: detailsValid && !scheduleValid },
      { label: 'Notes', completed: notesValid, active: detailsValid && scheduleValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(ProjectsActions.createProject({
      request: {
        opportunityId: value.opportunityId,
        name: value.name,
        projectReference: value.projectReference,
        description: value.description || undefined,
        projectManager: value.projectManager || undefined,
        siteAddress: value.siteAddress || undefined,
        startDate: value.startDate || undefined,
        targetEndDate: value.targetEndDate || undefined,
        budget: value.budget || undefined,
        totalUnits: value.totalUnits || undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
