import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { FormProgressComponent, FormStep } from '../../../shared/components/form-progress/form-progress.component';
import * as ConstructionActions from '../store/construction.actions';
import * as ConstructionSelectors from '../store/construction.selectors';

@Component({
  selector: 'app-create-stage-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    FormFieldComponent, FormProgressComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      {label: 'Home', url: '/dashboard'},
      {label: 'Construction', url: '/construction'},
      {label: 'Create Stage'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Construction Stage" subtitle="Add a new construction stage to track build progress">
      <a routerLink="/construction" class="btn btn-ghost btn-sm">← Back to Construction</a>
    </app-page-header>

    <app-page-description
      description="Define a construction stage for a project. Stages represent key phases of the build process such as foundations, structure, roofing, and finishing. Each stage can be tracked independently with inspections and snagging."
      guidance="Project ID and Stage Name are required. Planned dates help with scheduling and progress tracking."
      helpLink="/help/construction/creating-stages"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Stage Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Stage Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Project ID" fieldId="projectId" [required]="true"
              helpTooltip="The project this construction stage belongs to"
              [error]="form.get('projectId')?.touched && form.get('projectId')?.hasError('required') ? 'Please enter the project ID' : undefined">
              <input id="projectId" type="text" formControlName="projectId" class="input input-bordered w-full"
                [class.input-error]="form.get('projectId')?.invalid && form.get('projectId')?.touched"
                placeholder="e.g., paste the project GUID" />
            </app-form-field>

            <app-form-field label="Stage Name" fieldId="name" [required]="true"
              helpTooltip="A descriptive name for this construction stage"
              [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Please enter a stage name' : undefined">
              <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g., Foundations, Structural Frame, Roofing" />
            </app-form-field>

            <app-form-field label="Description" fieldId="description"
              helpTooltip="Brief description of what this stage covers">
              <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"
                placeholder="e.g., Excavation and pouring of concrete foundations including strip and pad foundations."></textarea>
            </app-form-field>
          </div>

          <!-- Step 2: Schedule -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Schedule
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Planned Start Date" fieldId="plannedStartDate"
              helpTooltip="When this stage is expected to begin">
              <input id="plannedStartDate" type="date" formControlName="plannedStartDate" class="input input-bordered w-full" />
            </app-form-field>

            <app-form-field label="Planned End Date" fieldId="plannedEndDate"
              helpTooltip="When this stage is expected to complete">
              <input id="plannedEndDate" type="date" formControlName="plannedEndDate" class="input input-bordered w-full" />
            </app-form-field>
          </div>

          <!-- Step 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Internal notes or additional context for this construction stage">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Requires specialist piling contractor. Ground conditions report indicates clay soil."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/construction" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Stage }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateStageFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      projectId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      plannedStartDate: [''],
      plannedEndDate: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(ConstructionSelectors.selectStagesLoading);
    this.error$ = this.store.select(ConstructionSelectors.selectError);
  }

  formSteps(): FormStep[] {
    const detailsValid = !!this.form?.get('projectId')?.valid &&
      !!this.form?.get('name')?.valid;
    const scheduleValid = !!this.form?.get('plannedStartDate')?.value ||
      !!this.form?.get('plannedEndDate')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Stage Details', completed: detailsValid, active: !detailsValid },
      { label: 'Schedule', completed: scheduleValid, active: detailsValid && !scheduleValid },
      { label: 'Notes', completed: notesValid, active: detailsValid && scheduleValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(ConstructionActions.createStage({
      projectId: value.projectId,
      request: {
        name: value.name,
        description: value.description || undefined,
        plannedStartDate: value.plannedStartDate || undefined,
        plannedEndDate: value.plannedEndDate || undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
