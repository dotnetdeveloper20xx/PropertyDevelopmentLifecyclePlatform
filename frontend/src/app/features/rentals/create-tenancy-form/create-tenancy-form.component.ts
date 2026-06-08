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
import { RentFrequency } from '../../../core/models/rental.model';
import * as RentalsActions from '../store/rentals.actions';
import * as RentalsSelectors from '../store/rentals.selectors';

@Component({
  selector: 'app-create-tenancy-form',
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
      {label: 'Rentals', url: '/rentals'},
      {label: 'Create Tenancy'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Tenancy" subtitle="Set up a new tenancy agreement for a property unit">
      <a routerLink="/rentals" class="btn btn-ghost btn-sm">← Back to Rentals</a>
    </app-page-header>

    <app-page-description
      description="Create a tenancy record linking a tenant to a property unit. Track rent amounts, lease dates, deposit, and tenant contact details. Tenancies provide the foundation for rent collection and property management."
      guidance="Unit ID, Tenant Name, Rent Amount, Rent Frequency, and Lease Start Date are required. End date is recommended for fixed-term tenancies."
      helpLink="/help/rentals/creating-tenancies"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Property & Tenant -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Property & Tenant
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Unit ID" fieldId="unitId" [required]="true"
              helpTooltip="The property unit being rented"
              [error]="form.get('unitId')?.touched && form.get('unitId')?.hasError('required') ? 'Please enter the unit ID' : undefined">
              <input id="unitId" type="text" formControlName="unitId" class="input input-bordered w-full"
                [class.input-error]="form.get('unitId')?.invalid && form.get('unitId')?.touched"
                placeholder="e.g., paste the unit GUID" />
            </app-form-field>

            <app-form-field label="Tenant Name" fieldId="tenantName" [required]="true"
              helpTooltip="Full name of the tenant"
              [error]="form.get('tenantName')?.touched && form.get('tenantName')?.hasError('required') ? 'Please enter the tenant name' : undefined">
              <input id="tenantName" type="text" formControlName="tenantName" class="input input-bordered w-full"
                [class.input-error]="form.get('tenantName')?.invalid && form.get('tenantName')?.touched"
                placeholder="e.g., David Wilson" />
            </app-form-field>

            <app-form-field label="Tenant Email" fieldId="tenantEmail"
              helpTooltip="Tenant's email address for correspondence"
              [error]="form.get('tenantEmail')?.touched && form.get('tenantEmail')?.hasError('email') ? 'Please enter a valid email address' : undefined">
              <input id="tenantEmail" type="email" formControlName="tenantEmail" class="input input-bordered w-full"
                [class.input-error]="form.get('tenantEmail')?.invalid && form.get('tenantEmail')?.touched"
                placeholder="e.g., david.wilson@email.com" />
            </app-form-field>

            <app-form-field label="Tenant Phone" fieldId="tenantPhone"
              helpTooltip="Tenant's phone number">
              <input id="tenantPhone" type="tel" formControlName="tenantPhone" class="input input-bordered w-full"
                placeholder="e.g., 07700 123456" />
            </app-form-field>
          </div>

          <!-- Step 2: Rent & Lease Terms -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Rent & Lease Terms
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Rent Amount (£)" fieldId="rentAmount" [required]="true"
              helpTooltip="The periodic rent amount"
              [error]="form.get('rentAmount')?.touched && form.get('rentAmount')?.hasError('required') ? 'Please enter the rent amount' : undefined">
              <input id="rentAmount" type="number" formControlName="rentAmount" class="input input-bordered w-full"
                [class.input-error]="form.get('rentAmount')?.invalid && form.get('rentAmount')?.touched"
                step="0.01" placeholder="e.g., 1500.00" />
            </app-form-field>

            <app-form-field label="Rent Frequency" fieldId="rentFrequency" [required]="true"
              helpTooltip="How often rent is payable"
              [error]="form.get('rentFrequency')?.touched && form.get('rentFrequency')?.hasError('required') ? 'Please select rent frequency' : undefined">
              <select id="rentFrequency" formControlName="rentFrequency" class="select select-bordered w-full"
                [class.select-error]="form.get('rentFrequency')?.invalid && form.get('rentFrequency')?.touched">
                <option value="">Select frequency...</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </app-form-field>

            <app-form-field label="Lease Start Date" fieldId="startDate" [required]="true"
              helpTooltip="When the tenancy begins"
              [error]="form.get('startDate')?.touched && form.get('startDate')?.hasError('required') ? 'Please enter the lease start date' : undefined">
              <input id="startDate" type="date" formControlName="startDate" class="input input-bordered w-full"
                [class.input-error]="form.get('startDate')?.invalid && form.get('startDate')?.touched" />
            </app-form-field>

            <app-form-field label="Lease End Date" fieldId="endDate"
              helpTooltip="When the tenancy ends (leave blank for periodic tenancy)">
              <input id="endDate" type="date" formControlName="endDate" class="input input-bordered w-full" />
            </app-form-field>

            <app-form-field label="Deposit Amount (£)" fieldId="depositAmount"
              helpTooltip="Security deposit held for the tenancy">
              <input id="depositAmount" type="number" formControlName="depositAmount" class="input input-bordered w-full"
                step="0.01" placeholder="e.g., 1500.00" />
            </app-form-field>
          </div>

          <!-- Step 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Additional notes about the tenancy agreement or tenant">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Tenant works from home, requires quiet hours. Parking space #12 allocated. No pets clause included."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/rentals" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Tenancy }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateTenancyFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      unitId: ['', Validators.required],
      tenantName: ['', [Validators.required, Validators.maxLength(200)]],
      tenantEmail: ['', Validators.email],
      tenantPhone: [''],
      rentAmount: [null, [Validators.required, Validators.min(0.01)]],
      rentFrequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      depositAmount: [null],
      notes: ['']
    });
    this.loading$ = this.store.select(RentalsSelectors.selectRentalsLoading);
    this.error$ = this.store.select(RentalsSelectors.selectRentalsError);
  }

  formSteps(): FormStep[] {
    const propertyValid = !!this.form?.get('unitId')?.valid &&
      !!this.form?.get('tenantName')?.valid;
    const leaseValid = !!this.form?.get('rentAmount')?.valid &&
      !!this.form?.get('rentFrequency')?.valid &&
      !!this.form?.get('startDate')?.valid;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Property & Tenant', completed: propertyValid, active: !propertyValid },
      { label: 'Rent & Lease', completed: leaseValid, active: propertyValid && !leaseValid },
      { label: 'Notes', completed: notesValid, active: propertyValid && leaseValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(RentalsActions.createTenancy({
      request: {
        unitId: value.unitId,
        tenantName: value.tenantName,
        tenantEmail: value.tenantEmail || undefined,
        tenantPhone: value.tenantPhone || undefined,
        rentAmount: value.rentAmount,
        rentFrequency: value.rentFrequency as RentFrequency,
        startDate: value.startDate,
        endDate: value.endDate || undefined,
        depositAmount: value.depositAmount ?? undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
