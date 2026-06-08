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
import { ContractorType } from '../../../core/models/contractor.model';
import * as ContractorsActions from '../store/contractors.actions';
import * as ContractorsSelectors from '../store/contractors.selectors';

@Component({
  selector: 'app-create-contractor-form',
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
      {label: 'Contractors', url: '/contractors'},
      {label: 'Create Contractor'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Contractor" subtitle="Register a new contractor or supplier in the system">
      <a routerLink="/contractors" class="btn btn-ghost btn-sm">← Back to Contractors</a>
    </app-page-header>

    <app-page-description
      description="Add a new contractor, subcontractor, consultant, or supplier to the database. Contractors can be assigned to projects and their performance, insurance, and certifications tracked over time."
      guidance="Company Name and Type are required. Add contact details and insurance information to maintain a complete contractor record."
      helpLink="/help/contractors/creating-contractors"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Company Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Company Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Company Name" fieldId="companyName" [required]="true"
              helpTooltip="The registered company or trading name"
              [error]="form.get('companyName')?.touched && form.get('companyName')?.hasError('required') ? 'Please enter the company name' : undefined">
              <input id="companyName" type="text" formControlName="companyName" class="input input-bordered w-full"
                [class.input-error]="form.get('companyName')?.invalid && form.get('companyName')?.touched"
                placeholder="e.g., Smith & Sons Construction Ltd" />
            </app-form-field>

            <app-form-field label="Type" fieldId="type" [required]="true"
              helpTooltip="The classification of this contractor"
              [error]="form.get('type')?.touched && form.get('type')?.hasError('required') ? 'Please select a contractor type' : undefined">
              <select id="type" formControlName="type" class="select select-bordered w-full"
                [class.select-error]="form.get('type')?.invalid && form.get('type')?.touched">
                <option value="">Select type...</option>
                <option value="MainContractor">Main Contractor</option>
                <option value="Subcontractor">Subcontractor</option>
                <option value="Consultant">Consultant</option>
                <option value="Supplier">Supplier</option>
                <option value="Specialist">Specialist</option>
              </select>
            </app-form-field>

            <app-form-field label="Trade" fieldId="trade"
              helpTooltip="The primary trade or specialism (e.g., Electrical, Plumbing, Roofing)">
              <input id="trade" type="text" formControlName="trade" class="input input-bordered w-full"
                placeholder="e.g., Electrical, Plumbing, Structural Steel" />
            </app-form-field>

            <app-form-field label="Address" fieldId="address"
              helpTooltip="Registered business address">
              <input id="address" type="text" formControlName="address" class="input input-bordered w-full"
                placeholder="e.g., 45 Industrial Estate, Manchester, M1 2AB" />
            </app-form-field>
          </div>

          <!-- Step 2: Contact Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Contact Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Contact Name" fieldId="contactName"
              helpTooltip="Primary contact person at the company">
              <input id="contactName" type="text" formControlName="contactName" class="input input-bordered w-full"
                placeholder="e.g., James Wilson" />
            </app-form-field>

            <app-form-field label="Email" fieldId="email"
              helpTooltip="Primary contact email address"
              [error]="form.get('email')?.touched && form.get('email')?.hasError('email') ? 'Please enter a valid email address' : undefined">
              <input id="email" type="email" formControlName="email" class="input input-bordered w-full"
                [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched"
                placeholder="e.g., info@smithconstruction.co.uk" />
            </app-form-field>

            <app-form-field label="Phone" fieldId="phone"
              helpTooltip="Primary contact phone number">
              <input id="phone" type="tel" formControlName="phone" class="input input-bordered w-full"
                placeholder="e.g., 020 7123 4567" />
            </app-form-field>
          </div>

          <!-- Step 3: Insurance & Certifications -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Insurance & Certifications
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Insurance Details" fieldId="insuranceDetails"
              helpTooltip="Public liability and professional indemnity insurance details">
              <textarea id="insuranceDetails" formControlName="insuranceDetails" class="textarea textarea-bordered w-full" rows="3"
                placeholder="e.g., Public Liability: £10M, Professional Indemnity: £5M, Employer's Liability: £10M"></textarea>
            </app-form-field>

            <app-form-field label="Certifications" fieldId="certifications"
              helpTooltip="Relevant industry certifications (e.g., CSCS, ISO, CHAS)">
              <textarea id="certifications" formControlName="certifications" class="textarea textarea-bordered w-full" rows="3"
                placeholder="e.g., CSCS Registered, ISO 9001, CHAS Accredited, Constructionline Gold"></textarea>
            </app-form-field>
          </div>

          <!-- Step 4: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            4. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Internal notes about this contractor">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Preferred contractor for residential projects. Excellent track record on previous developments."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/contractors" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Contractor }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateContractorFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(200)]],
      type: ['', Validators.required],
      trade: [''],
      contactName: [''],
      email: ['', Validators.email],
      phone: [''],
      address: [''],
      insuranceDetails: [''],
      certifications: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(ContractorsSelectors.selectContractorsLoading);
    this.error$ = this.store.select(ContractorsSelectors.selectContractorsError);
  }

  formSteps(): FormStep[] {
    const companyValid = !!this.form?.get('companyName')?.valid &&
      !!this.form?.get('type')?.valid;
    const contactValid = !!this.form?.get('contactName')?.value ||
      !!this.form?.get('email')?.value ||
      !!this.form?.get('phone')?.value;
    const insuranceValid = !!this.form?.get('insuranceDetails')?.value ||
      !!this.form?.get('certifications')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Company Details', completed: companyValid, active: !companyValid },
      { label: 'Contact Info', completed: contactValid, active: companyValid && !contactValid },
      { label: 'Insurance & Certs', completed: insuranceValid, active: companyValid && contactValid && !insuranceValid },
      { label: 'Notes', completed: notesValid, active: companyValid && contactValid && insuranceValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(ContractorsActions.createContractor({
      request: {
        companyName: value.companyName,
        type: value.type as ContractorType,
        trade: value.trade || undefined,
        contactName: value.contactName || undefined,
        email: value.email || undefined,
        phone: value.phone || undefined,
        address: value.address || undefined,
        insuranceDetails: value.insuranceDetails || undefined,
        certifications: value.certifications || undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
