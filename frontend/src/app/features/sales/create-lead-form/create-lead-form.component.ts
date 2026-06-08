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
import { LeadSource } from '../../../core/models/sales.model';
import * as SalesActions from '../store/sales.actions';
import * as SalesSelectors from '../store/sales.selectors';

@Component({
  selector: 'app-create-lead-form',
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
      {label: 'Sales', url: '/sales'},
      {label: 'Create Lead'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Sales Lead" subtitle="Register a new prospective buyer or interested party">
      <a routerLink="/sales" class="btn btn-ghost btn-sm">← Back to Sales</a>
    </app-page-header>

    <app-page-description
      description="Capture a new sales lead for your development projects. Leads track prospective buyers through the sales pipeline from initial enquiry to completion. Record their contact details, source, budget, and unit interest."
      guidance="Lead Name and Source are required. Contact details and budget help qualify the lead and prioritize follow-up."
      helpLink="/help/sales/creating-leads"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Lead Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Lead Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Name" fieldId="name" [required]="true"
              helpTooltip="Full name of the prospective buyer"
              [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Please enter the lead name' : undefined">
              <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g., Sarah Johnson" />
            </app-form-field>

            <app-form-field label="Source" fieldId="source" [required]="true"
              helpTooltip="How did this lead find us?"
              [error]="form.get('source')?.touched && form.get('source')?.hasError('required') ? 'Please select a lead source' : undefined">
              <select id="source" formControlName="source" class="select select-bordered w-full"
                [class.select-error]="form.get('source')?.invalid && form.get('source')?.touched">
                <option value="">Select source...</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Agent">Agent</option>
                <option value="Advertisement">Advertisement</option>
                <option value="WalkIn">Walk-In</option>
                <option value="Portal">Portal</option>
                <option value="Other">Other</option>
              </select>
            </app-form-field>
          </div>

          <!-- Step 2: Contact Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Contact Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Email" fieldId="email"
              helpTooltip="Contact email address"
              [error]="form.get('email')?.touched && form.get('email')?.hasError('email') ? 'Please enter a valid email address' : undefined">
              <input id="email" type="email" formControlName="email" class="input input-bordered w-full"
                [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched"
                placeholder="e.g., sarah.johnson@email.com" />
            </app-form-field>

            <app-form-field label="Phone" fieldId="phone"
              helpTooltip="Contact phone number">
              <input id="phone" type="tel" formControlName="phone" class="input input-bordered w-full"
                placeholder="e.g., 07700 900000" />
            </app-form-field>
          </div>

          <!-- Step 3: Interest & Budget -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Interest & Budget
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Interested Unit ID" fieldId="interestedUnitId"
              helpTooltip="If they are interested in a specific unit, paste the unit ID">
              <input id="interestedUnitId" type="text" formControlName="interestedUnitId" class="input input-bordered w-full"
                placeholder="e.g., paste the unit GUID (optional)" />
            </app-form-field>

            <app-form-field label="Budget (£)" fieldId="budget"
              helpTooltip="The buyer's stated budget or maximum spend">
              <input id="budget" type="number" formControlName="budget" class="input input-bordered w-full"
                step="0.01" placeholder="e.g., 500000.00" />
            </app-form-field>
          </div>

          <!-- Step 4: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            4. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Additional notes about the lead's requirements, preferences, or conversations">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Looking for 2-bed with parking. First-time buyer. Needs help with mortgage. Available for viewings weekends only."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/sales" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Lead }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateLeadFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      source: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      interestedUnitId: [''],
      budget: [null],
      notes: ['']
    });
    this.loading$ = this.store.select(SalesSelectors.selectSalesLoading);
    this.error$ = this.store.select(SalesSelectors.selectSalesError);
  }

  formSteps(): FormStep[] {
    const detailsValid = !!this.form?.get('name')?.valid &&
      !!this.form?.get('source')?.valid;
    const contactValid = !!this.form?.get('email')?.value ||
      !!this.form?.get('phone')?.value;
    const interestValid = !!this.form?.get('interestedUnitId')?.value ||
      !!this.form?.get('budget')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Lead Details', completed: detailsValid, active: !detailsValid },
      { label: 'Contact Info', completed: contactValid, active: detailsValid && !contactValid },
      { label: 'Interest & Budget', completed: interestValid, active: detailsValid && contactValid && !interestValid },
      { label: 'Notes', completed: notesValid, active: detailsValid && contactValid && interestValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(SalesActions.createSalesLead({
      request: {
        name: value.name,
        source: value.source as LeadSource,
        email: value.email || undefined,
        phone: value.phone || undefined,
        interestedUnitId: value.interestedUnitId || undefined,
        budget: value.budget ?? undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
