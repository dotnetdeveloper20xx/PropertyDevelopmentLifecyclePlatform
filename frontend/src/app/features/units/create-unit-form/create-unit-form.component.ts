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
import { UnitType } from '../../../core/models/unit.model';
import * as UnitsActions from '../store/units.actions';
import * as UnitsSelectors from '../store/units.selectors';

@Component({
  selector: 'app-create-unit-form',
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
      {label: 'Units', url: '/units'},
      {label: 'Create Unit'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Property Unit" subtitle="Add a new unit to a development project">
      <a routerLink="/units" class="btn btn-ghost btn-sm">← Back to Units</a>
    </app-page-header>

    <app-page-description
      description="Define a property unit within a development project. Units represent individual sellable or rentable properties such as apartments, houses, studios, or penthouses. Track type, size, pricing, and availability."
      guidance="Project ID, Unit Reference, Bedrooms, and Price are required. Unit Type defaults to Apartment if not specified."
      helpLink="/help/units/creating-units"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Unit Identity -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Unit Identity
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Project ID" fieldId="projectId" [required]="true"
              helpTooltip="The development project this unit belongs to"
              [error]="form.get('projectId')?.touched && form.get('projectId')?.hasError('required') ? 'Please enter the project ID' : undefined">
              <input id="projectId" type="text" formControlName="projectId" class="input input-bordered w-full"
                [class.input-error]="form.get('projectId')?.invalid && form.get('projectId')?.touched"
                placeholder="e.g., paste the project GUID" />
            </app-form-field>

            <app-form-field label="Unit Reference" fieldId="reference" [required]="true"
              helpTooltip="Unique reference for this unit within the project (e.g., A-101, H-05)"
              [error]="form.get('reference')?.touched && form.get('reference')?.hasError('required') ? 'Please enter a unit reference' : undefined">
              <input id="reference" type="text" formControlName="reference" class="input input-bordered w-full"
                [class.input-error]="form.get('reference')?.invalid && form.get('reference')?.touched"
                placeholder="e.g., A-101, H-05, PH-01" />
            </app-form-field>

            <app-form-field label="Unit Type" fieldId="type"
              helpTooltip="The type of property unit">
              <select id="type" formControlName="type" class="select select-bordered w-full">
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Commercial">Commercial</option>
                <option value="Parking">Parking</option>
              </select>
            </app-form-field>

            <app-form-field label="Floor" fieldId="floor"
              helpTooltip="The floor level (0 for ground, negative for basement)">
              <input id="floor" type="number" formControlName="floor" class="input input-bordered w-full"
                placeholder="e.g., 3" />
            </app-form-field>
          </div>

          <!-- Step 2: Specifications -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Specifications
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Bedrooms" fieldId="bedrooms" [required]="true"
              helpTooltip="Number of bedrooms"
              [error]="form.get('bedrooms')?.touched && form.get('bedrooms')?.hasError('required') ? 'Please enter the number of bedrooms' : undefined">
              <input id="bedrooms" type="number" formControlName="bedrooms" class="input input-bordered w-full"
                [class.input-error]="form.get('bedrooms')?.invalid && form.get('bedrooms')?.touched"
                min="0" placeholder="e.g., 2" />
            </app-form-field>

            <app-form-field label="Bathrooms" fieldId="bathrooms"
              helpTooltip="Number of bathrooms">
              <input id="bathrooms" type="number" formControlName="bathrooms" class="input input-bordered w-full"
                min="0" placeholder="e.g., 1" />
            </app-form-field>

            <app-form-field label="Floor Area (sq ft)" fieldId="areaSqFt"
              helpTooltip="Total internal floor area in square feet">
              <input id="areaSqFt" type="number" formControlName="areaSqFt" class="input input-bordered w-full"
                step="0.01" placeholder="e.g., 850" />
            </app-form-field>

            <app-form-field label="Price (£)" fieldId="price" [required]="true"
              helpTooltip="The asking or list price for this unit"
              [error]="form.get('price')?.touched && form.get('price')?.hasError('required') ? 'Please enter the price' : undefined">
              <input id="price" type="number" formControlName="price" class="input input-bordered w-full"
                [class.input-error]="form.get('price')?.invalid && form.get('price')?.touched"
                step="0.01" placeholder="e.g., 350000.00" />
            </app-form-field>
          </div>

          <!-- Step 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Additional notes about this unit (special features, parking, views)">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Corner unit with dual aspect. Includes private balcony and allocated parking space."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/units" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Unit }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateUnitFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      projectId: ['', Validators.required],
      reference: ['', [Validators.required, Validators.maxLength(50)]],
      type: ['Apartment'],
      floor: [null],
      bedrooms: [null, [Validators.required, Validators.min(0)]],
      bathrooms: [null],
      areaSqFt: [null],
      price: [null, [Validators.required, Validators.min(0.01)]],
      notes: ['']
    });
    this.loading$ = this.store.select(UnitsSelectors.selectUnitsLoading);
    this.error$ = this.store.select(UnitsSelectors.selectUnitsError);
  }

  formSteps(): FormStep[] {
    const identityValid = !!this.form?.get('projectId')?.valid &&
      !!this.form?.get('reference')?.valid;
    const specsValid = !!this.form?.get('bedrooms')?.valid &&
      !!this.form?.get('price')?.valid;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Unit Identity', completed: identityValid, active: !identityValid },
      { label: 'Specifications', completed: specsValid, active: identityValid && !specsValid },
      { label: 'Notes', completed: notesValid, active: identityValid && specsValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(UnitsActions.createUnit({
      projectId: value.projectId,
      request: {
        reference: value.reference,
        type: value.type as UnitType,
        floor: value.floor ?? undefined,
        bedrooms: value.bedrooms,
        bathrooms: value.bathrooms ?? undefined,
        areaSqFt: value.areaSqFt ?? undefined,
        price: value.price,
        notes: value.notes || undefined
      }
    }));
  }
}
