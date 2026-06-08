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
import { InvestorType } from '../../../core/models/investor.model';
import * as InvestorsActions from '../store/investors.actions';
import * as InvestorsSelectors from '../store/investors.selectors';

@Component({
  selector: 'app-create-investor-form',
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
      {label: 'Investors', url: '/investors'},
      {label: 'Create Investor'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Investor" subtitle="Register a new investor or funding partner">
      <a routerLink="/investors" class="btn btn-ghost btn-sm">← Back to Investors</a>
    </app-page-header>

    <app-page-description
      description="Add a new investor to the system. Investors can be individuals, corporates, institutional funds, family offices, or syndicates. Track their contact details, investments, and returns across projects."
      guidance="Investor Name and Type are required. Contact information helps maintain effective investor relations."
      helpLink="/help/investors/creating-investors"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Investor Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Investor Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Investor Name" fieldId="name" [required]="true"
              helpTooltip="Full name of the investor or entity"
              [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Please enter the investor name' : undefined">
              <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g., John Smith or Acme Investments Ltd" />
            </app-form-field>

            <app-form-field label="Type" fieldId="type" [required]="true"
              helpTooltip="The classification of this investor"
              [error]="form.get('type')?.touched && form.get('type')?.hasError('required') ? 'Please select an investor type' : undefined">
              <select id="type" formControlName="type" class="select select-bordered w-full"
                [class.select-error]="form.get('type')?.invalid && form.get('type')?.touched">
                <option value="">Select type...</option>
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="Institutional">Institutional</option>
                <option value="FamilyOffice">Family Office</option>
                <option value="Syndicate">Syndicate</option>
              </select>
            </app-form-field>

            <app-form-field label="Company" fieldId="company"
              helpTooltip="Company or entity name (if applicable)">
              <input id="company" type="text" formControlName="company" class="input input-bordered w-full"
                placeholder="e.g., Acme Investments Ltd" />
            </app-form-field>
          </div>

          <!-- Step 2: Contact Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Contact Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Email" fieldId="email"
              helpTooltip="Primary contact email address"
              [error]="form.get('email')?.touched && form.get('email')?.hasError('email') ? 'Please enter a valid email address' : undefined">
              <input id="email" type="email" formControlName="email" class="input input-bordered w-full"
                [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched"
                placeholder="e.g., investor@example.com" />
            </app-form-field>

            <app-form-field label="Phone" fieldId="phone"
              helpTooltip="Primary contact phone number">
              <input id="phone" type="tel" formControlName="phone" class="input input-bordered w-full"
                placeholder="e.g., +44 20 7123 4567" />
            </app-form-field>
          </div>

          <!-- Step 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Internal notes about this investor's preferences, history, or requirements">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Interested in residential developments in London. Minimum investment £500k. Prefers quarterly reporting."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/investors" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Investor }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateInvestorFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      type: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      company: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(InvestorsSelectors.selectInvestorsLoading);
    this.error$ = this.store.select(InvestorsSelectors.selectInvestorsError);
  }

  formSteps(): FormStep[] {
    const detailsValid = !!this.form?.get('name')?.valid &&
      !!this.form?.get('type')?.valid;
    const contactValid = !!this.form?.get('email')?.value ||
      !!this.form?.get('phone')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Investor Details', completed: detailsValid, active: !detailsValid },
      { label: 'Contact Info', completed: contactValid, active: detailsValid && !contactValid },
      { label: 'Notes', completed: notesValid, active: detailsValid && contactValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(InvestorsActions.createInvestor({
      request: {
        name: value.name,
        type: value.type as InvestorType,
        email: value.email || undefined,
        phone: value.phone || undefined,
        company: value.company || undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
