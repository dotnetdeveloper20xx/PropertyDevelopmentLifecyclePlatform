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
import * as PlanningActions from '../store/planning.actions';
import * as PlanningSelectors from '../store/planning.selectors';

@Component({
  selector: 'app-planning-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    FormFieldComponent, FormProgressComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Planning', url: '/planning'}, {label: 'Create Application'}]"></app-breadcrumb>
    <app-page-header title="Create Planning Application" subtitle="Submit a new planning application linked to a land opportunity">
      <a routerLink="/planning" class="btn btn-ghost btn-sm">← Back to Applications</a>
    </app-page-header>
    <app-page-description
      description="Provide the details of your planning application. Link it to an existing land opportunity and specify the local authority you are submitting to."
      guidance="Application Reference, Description, Local Authority, and Application Type are required. You can add dates and officer details later."
      helpLink="/help/planning/planning-lifecycle"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Section 1: Core Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Application Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Opportunity ID" fieldId="opportunityId" [required]="true"
              helpTooltip="The ID of the land opportunity this application relates to."
              [error]="form.get('opportunityId')?.touched && form.get('opportunityId')?.hasError('required') ? 'Please enter the opportunity ID' : undefined">
              <input id="opportunityId" type="text" formControlName="opportunityId" class="input input-bordered w-full"
                [class.input-error]="form.get('opportunityId')?.invalid && form.get('opportunityId')?.touched"
                placeholder="e.g., paste the opportunity GUID" />
            </app-form-field>

            <app-form-field label="Application Reference" fieldId="applicationReference" [required]="true"
              helpTooltip="The unique reference number assigned by the local council (e.g., PA/2024/001)"
              [error]="form.get('applicationReference')?.touched && form.get('applicationReference')?.hasError('required') ? 'Please enter the application reference' : undefined">
              <input id="applicationReference" type="text" formControlName="applicationReference" class="input input-bordered w-full"
                [class.input-error]="form.get('applicationReference')?.invalid && form.get('applicationReference')?.touched"
                placeholder="e.g., PA/2024/001" />
            </app-form-field>

            <app-form-field label="Local Authority" fieldId="localAuthority" [required]="true"
              helpTooltip="The local council the application is submitted to"
              [error]="form.get('localAuthority')?.touched && form.get('localAuthority')?.hasError('required') ? 'Please enter the local authority' : undefined">
              <input id="localAuthority" type="text" formControlName="localAuthority" class="input input-bordered w-full"
                [class.input-error]="form.get('localAuthority')?.invalid && form.get('localAuthority')?.touched"
                placeholder="e.g., Westminster City Council" />
            </app-form-field>

            <app-form-field label="Application Type" fieldId="applicationType" [required]="true"
              helpTooltip="The type of planning application (Full, Outline, Reserved Matters, etc.)"
              [error]="form.get('applicationType')?.touched && form.get('applicationType')?.hasError('required') ? 'Please select an application type' : undefined">
              <select id="applicationType" formControlName="applicationType" class="select select-bordered w-full"
                [class.select-error]="form.get('applicationType')?.invalid && form.get('applicationType')?.touched">
                <option value="">Select type...</option>
                <option value="Full Planning">Full Planning</option>
                <option value="Outline">Outline</option>
                <option value="Reserved Matters">Reserved Matters</option>
                <option value="Householder">Householder</option>
                <option value="Listed Building Consent">Listed Building Consent</option>
                <option value="Change of Use">Change of Use</option>
                <option value="Prior Approval">Prior Approval</option>
              </select>
            </app-form-field>
          </div>

          <app-form-field label="Description" fieldId="description" [required]="true"
            helpTooltip="A brief description of what is being proposed"
            [error]="form.get('description')?.touched && form.get('description')?.hasError('required') ? 'Please enter a description of the application' : undefined">
            <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"
              [class.textarea-error]="form.get('description')?.invalid && form.get('description')?.touched"
              placeholder="e.g., Demolition of existing buildings and erection of 50 residential units..."></textarea>
          </app-form-field>

          <!-- Section 2: Dates & Officer -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Submission & Contact
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Submission Date" fieldId="submissionDate"
              helpTooltip="Date the application was submitted to the council (leave blank if not yet submitted)">
              <input id="submissionDate" type="date" formControlName="submissionDate" class="input input-bordered w-full" />
            </app-form-field>

            <app-form-field label="Application Fee (£)" fieldId="applicationFee"
              helpTooltip="The planning fee paid to the council">
              <input id="applicationFee" type="number" formControlName="applicationFee" class="input input-bordered w-full"
                step="0.01" placeholder="e.g., 462.00" />
            </app-form-field>

            <app-form-field label="Planning Officer" fieldId="planningOfficer"
              helpTooltip="Name of the assigned planning officer at the council">
              <input id="planningOfficer" type="text" formControlName="planningOfficer" class="input input-bordered w-full"
                placeholder="e.g., James Wilson" />
            </app-form-field>

            <app-form-field label="Case Officer Email" fieldId="caseOfficerEmail"
              helpTooltip="Email of the case officer for correspondence">
              <input id="caseOfficerEmail" type="email" formControlName="caseOfficerEmail" class="input input-bordered w-full"
                placeholder="e.g., j.wilson@council.gov.uk" />
            </app-form-field>

            <app-form-field label="Site Address" fieldId="siteAddress"
              helpTooltip="The full address of the development site">
              <input id="siteAddress" type="text" formControlName="siteAddress" class="input input-bordered w-full"
                placeholder="e.g., Land at Riverside Road, SW18" />
            </app-form-field>

            <app-form-field label="Ward" fieldId="ward"
              helpTooltip="The council ward the site falls within">
              <input id="ward" type="text" formControlName="ward" class="input input-bordered w-full"
                placeholder="e.g., Wandsworth Town" />
            </app-form-field>
          </div>

          <!-- Section 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            3. Additional Notes
          </h3>
          <app-form-field label="Notes" fieldId="notes"
            helpTooltip="Any additional context or internal notes about this application">
            <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"
              placeholder="e.g., Pre-app feedback was positive. Officer encouraged full submission."></textarea>
          </app-form-field>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/planning" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Application }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PlanningFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      opportunityId: ['', Validators.required],
      applicationReference: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      localAuthority: ['', [Validators.required, Validators.maxLength(200)]],
      applicationType: ['', Validators.required],
      submissionDate: [''],
      applicationFee: [null],
      planningOfficer: [''],
      caseOfficerEmail: [''],
      siteAddress: [''],
      ward: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(PlanningSelectors.selectPlanningLoading);
    this.error$ = this.store.select(PlanningSelectors.selectPlanningError);
  }

  formSteps(): FormStep[] {
    const coreValid = !!this.form?.get('opportunityId')?.valid &&
      !!this.form?.get('applicationReference')?.valid &&
      !!this.form?.get('localAuthority')?.valid &&
      !!this.form?.get('applicationType')?.valid &&
      !!this.form?.get('description')?.valid;
    const contactValid = !!this.form?.get('submissionDate')?.value || !!this.form?.get('planningOfficer')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Application Details', completed: coreValid, active: !coreValid },
      { label: 'Submission & Contact', completed: contactValid, active: coreValid && !contactValid },
      { label: 'Notes', completed: notesValid, active: coreValid && contactValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(PlanningActions.createApplication({
      request: {
        ...value,
        submissionDate: value.submissionDate || undefined,
        applicationFee: value.applicationFee || undefined
      }
    }));
  }
}
