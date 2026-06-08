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
import * as ProcurementActions from '../store/procurement.actions';
import * as ProcurementSelectors from '../store/procurement.selectors';

@Component({
  selector: 'app-create-order-form',
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
      {label: 'Procurement', url: '/procurement'},
      {label: 'Create Purchase Order'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Purchase Order" subtitle="Raise a new purchase order for materials or services">
      <a routerLink="/procurement" class="btn btn-ghost btn-sm">← Back to Procurement</a>
    </app-page-header>

    <app-page-description
      description="Create a purchase order to track procurement of materials, equipment, or services from suppliers. Each PO is linked to a project and tracks supplier details, value, and expected delivery."
      guidance="Project ID, Order Reference, Supplier Name, and Total Value are required. The order will be created in Draft status for review before submission."
      helpLink="/help/procurement/creating-orders"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Order Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Order Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Project ID" fieldId="projectId" [required]="true"
              helpTooltip="The project this purchase order is for"
              [error]="form.get('projectId')?.touched && form.get('projectId')?.hasError('required') ? 'Please enter the project ID' : undefined">
              <input id="projectId" type="text" formControlName="projectId" class="input input-bordered w-full"
                [class.input-error]="form.get('projectId')?.invalid && form.get('projectId')?.touched"
                placeholder="e.g., paste the project GUID" />
            </app-form-field>

            <app-form-field label="Order Reference" fieldId="orderReference" [required]="true"
              helpTooltip="Unique reference number for this purchase order (e.g., PO/2024/001)"
              [error]="form.get('orderReference')?.touched && form.get('orderReference')?.hasError('required') ? 'Please enter an order reference' : undefined">
              <input id="orderReference" type="text" formControlName="orderReference" class="input input-bordered w-full"
                [class.input-error]="form.get('orderReference')?.invalid && form.get('orderReference')?.touched"
                placeholder="e.g., PO/2024/001" />
            </app-form-field>

            <app-form-field label="Description" fieldId="description"
              helpTooltip="Brief description of what is being ordered">
              <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"
                placeholder="e.g., Structural steel beams for Phase 2 frame construction"></textarea>
            </app-form-field>
          </div>

          <!-- Step 2: Supplier & Value -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Supplier & Value
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Supplier Name" fieldId="supplierName" [required]="true"
              helpTooltip="The name of the supplier or vendor"
              [error]="form.get('supplierName')?.touched && form.get('supplierName')?.hasError('required') ? 'Please enter the supplier name' : undefined">
              <input id="supplierName" type="text" formControlName="supplierName" class="input input-bordered w-full"
                [class.input-error]="form.get('supplierName')?.invalid && form.get('supplierName')?.touched"
                placeholder="e.g., ABC Building Supplies Ltd" />
            </app-form-field>

            <app-form-field label="Supplier Contact" fieldId="supplierContact"
              helpTooltip="Contact person or details at the supplier">
              <input id="supplierContact" type="text" formControlName="supplierContact" class="input input-bordered w-full"
                placeholder="e.g., John Smith, 020 7123 4567" />
            </app-form-field>

            <app-form-field label="Total Value (£)" fieldId="totalValue" [required]="true"
              helpTooltip="Total order value including VAT"
              [error]="form.get('totalValue')?.touched && form.get('totalValue')?.hasError('required') ? 'Please enter the total value' : undefined">
              <input id="totalValue" type="number" formControlName="totalValue" class="input input-bordered w-full"
                [class.input-error]="form.get('totalValue')?.invalid && form.get('totalValue')?.touched"
                step="0.01" placeholder="e.g., 25000.00" />
            </app-form-field>

            <app-form-field label="Expected Delivery Date" fieldId="expectedDeliveryDate"
              helpTooltip="When the order is expected to be delivered">
              <input id="expectedDeliveryDate" type="date" formControlName="expectedDeliveryDate" class="input input-bordered w-full" />
            </app-form-field>
          </div>

          <!-- Step 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Additional notes or special delivery instructions">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Deliver to site entrance gate B. Contact site manager on arrival."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/procurement" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Purchase Order }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateOrderFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      projectId: ['', Validators.required],
      orderReference: ['', [Validators.required, Validators.maxLength(100)]],
      supplierName: ['', [Validators.required, Validators.maxLength(200)]],
      supplierContact: [''],
      description: [''],
      totalValue: [null, [Validators.required, Validators.min(0.01)]],
      expectedDeliveryDate: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(ProcurementSelectors.selectOrdersLoading);
    this.error$ = this.store.select(ProcurementSelectors.selectProcurementError);
  }

  formSteps(): FormStep[] {
    const orderValid = !!this.form?.get('projectId')?.valid &&
      !!this.form?.get('orderReference')?.valid;
    const supplierValid = !!this.form?.get('supplierName')?.valid &&
      !!this.form?.get('totalValue')?.valid;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Order Details', completed: orderValid, active: !orderValid },
      { label: 'Supplier & Value', completed: supplierValid, active: orderValid && !supplierValid },
      { label: 'Notes', completed: notesValid, active: orderValid && supplierValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(ProcurementActions.createOrder({
      projectId: value.projectId,
      request: {
        projectId: value.projectId,
        orderReference: value.orderReference,
        supplierName: value.supplierName,
        supplierContact: value.supplierContact || undefined,
        description: value.description || undefined,
        totalValue: value.totalValue,
        expectedDeliveryDate: value.expectedDeliveryDate || undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
