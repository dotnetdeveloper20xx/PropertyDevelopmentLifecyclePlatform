import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { FormProgressComponent, FormStep } from '../../../../shared/components/form-progress/form-progress.component';
import * as LegalActions from '../../store/legal.actions';
import * as LegalSelectors from '../../store/legal.selectors';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    FormFieldComponent, FormProgressComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Legal & Compliance', url: '/legal/contracts'}, {label: 'Contracts', url: '/legal/contracts'}, {label: 'Create Contract'}]"></app-breadcrumb>
    <app-page-header title="Create Contract" subtitle="Create a new legal contract linked to a land opportunity">
      <a routerLink="/legal/contracts" class="btn btn-ghost btn-sm">← Back to Contracts</a>
    </app-page-header>
    <app-page-description
      description="Define the contract details including the parties involved, solicitor information, and key terms. Contracts are linked to land opportunities and progress through a lifecycle from Draft to Completion."
      guidance="Opportunity ID, Title, Contract Type, Reference, and Counterparty Name are required. Solicitor and terms can be added or updated later."
      helpLink="/help/legal/contract-lifecycle"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Contract Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Contract Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Opportunity ID" fieldId="opportunityId" [required]="true"
              helpTooltip="The land opportunity this contract relates to"
              [error]="form.get('opportunityId')?.touched && form.get('opportunityId')?.hasError('required') ? 'Please enter the opportunity ID' : undefined">
              <input id="opportunityId" type="text" formControlName="opportunityId" class="input input-bordered w-full"
                [class.input-error]="form.get('opportunityId')?.invalid && form.get('opportunityId')?.touched"
                placeholder="e.g., paste the opportunity GUID" />
            </app-form-field>

            <app-form-field label="Title" fieldId="title" [required]="true"
              helpTooltip="A descriptive title for this contract"
              [error]="form.get('title')?.touched && form.get('title')?.hasError('required') ? 'Please enter a contract title' : undefined">
              <input id="title" type="text" formControlName="title" class="input input-bordered w-full"
                [class.input-error]="form.get('title')?.invalid && form.get('title')?.touched"
                placeholder="e.g., Sale and Purchase Agreement — Riverside Site" />
            </app-form-field>

            <app-form-field label="Contract Type" fieldId="contractType" [required]="true"
              helpTooltip="The type of legal agreement"
              [error]="form.get('contractType')?.touched && form.get('contractType')?.hasError('required') ? 'Please select a contract type' : undefined">
              <select id="contractType" formControlName="contractType" class="select select-bordered w-full"
                [class.select-error]="form.get('contractType')?.invalid && form.get('contractType')?.touched">
                <option value="">Select type...</option>
                <option value="SaleAndPurchase">Sale and Purchase</option>
                <option value="OptionAgreement">Option Agreement</option>
                <option value="ConditionalContract">Conditional Contract</option>
                <option value="Lease">Lease</option>
                <option value="JointVenture">Joint Venture</option>
                <option value="Consultancy">Consultancy</option>
              </select>
            </app-form-field>

            <app-form-field label="Contract Reference" fieldId="contractReference" [required]="true"
              helpTooltip="Unique reference number for this contract (e.g., CON/2024/001)"
              [error]="form.get('contractReference')?.touched && form.get('contractReference')?.hasError('required') ? 'Please enter a contract reference' : undefined">
              <input id="contractReference" type="text" formControlName="contractReference" class="input input-bordered w-full"
                [class.input-error]="form.get('contractReference')?.invalid && form.get('contractReference')?.touched"
                placeholder="e.g., CON/2024/001" />
            </app-form-field>

            <app-form-field label="Contract Value (£)" fieldId="contractValue"
              helpTooltip="The total monetary value of the contract">
              <input id="contractValue" type="number" formControlName="contractValue" class="input input-bordered w-full"
                step="0.01" placeholder="e.g., 1500000.00" />
            </app-form-field>
          </div>

          <!-- Step 2: Parties & Solicitor -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Parties & Solicitor
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Counterparty Name" fieldId="counterpartyName" [required]="true"
              helpTooltip="The other party entering into this contract (seller, landlord, partner, etc.)"
              [error]="form.get('counterpartyName')?.touched && form.get('counterpartyName')?.hasError('required') ? 'Please enter the counterparty name' : undefined">
              <input id="counterpartyName" type="text" formControlName="counterpartyName" class="input input-bordered w-full"
                [class.input-error]="form.get('counterpartyName')?.invalid && form.get('counterpartyName')?.touched"
                placeholder="e.g., Riverside Holdings Ltd" />
            </app-form-field>

            <app-form-field label="Counterparty Contact" fieldId="counterpartyContact"
              helpTooltip="Contact person or details for the counterparty">
              <input id="counterpartyContact" type="text" formControlName="counterpartyContact" class="input input-bordered w-full"
                placeholder="e.g., John Smith (020 7946 0958)" />
            </app-form-field>

            <app-form-field label="Solicitor" fieldId="solicitor"
              helpTooltip="Name of the solicitor handling this contract">
              <input id="solicitor" type="text" formControlName="solicitor" class="input input-bordered w-full"
                placeholder="e.g., Sarah Johnson" />
            </app-form-field>

            <app-form-field label="Solicitor Firm" fieldId="solicitorFirm"
              helpTooltip="The law firm representing us on this contract">
              <input id="solicitorFirm" type="text" formControlName="solicitorFirm" class="input input-bordered w-full"
                placeholder="e.g., Mills & Reeve LLP" />
            </app-form-field>

            <app-form-field label="Solicitor Email" fieldId="solicitorEmail"
              helpTooltip="Email address of the solicitor">
              <input id="solicitorEmail" type="email" formControlName="solicitorEmail" class="input input-bordered w-full"
                placeholder="e.g., s.johnson@millsreeve.com" />
            </app-form-field>
          </div>

          <!-- Step 3: Terms & Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Terms & Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Key Terms" fieldId="keyTerms"
              helpTooltip="Summary of the key contractual terms, conditions, or special clauses">
              <textarea id="keyTerms" formControlName="keyTerms" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Completion subject to planning approval. 10% deposit on exchange. Long-stop date 6 months from exchange."></textarea>
            </app-form-field>

            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Internal notes or additional context about this contract">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"
                placeholder="e.g., Solicitor confirmed draft ready for review by end of week."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/legal/contracts" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Contract }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ContractFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      opportunityId: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      contractType: ['', Validators.required],
      contractReference: ['', [Validators.required, Validators.maxLength(100)]],
      counterpartyName: ['', [Validators.required, Validators.maxLength(200)]],
      counterpartyContact: [''],
      contractValue: [null],
      solicitor: [''],
      solicitorFirm: [''],
      solicitorEmail: ['', Validators.email],
      keyTerms: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(LegalSelectors.selectLegalLoading);
    this.error$ = this.store.select(LegalSelectors.selectLegalError);
  }

  formSteps(): FormStep[] {
    const detailsValid = !!this.form?.get('opportunityId')?.valid &&
      !!this.form?.get('title')?.valid &&
      !!this.form?.get('contractType')?.valid &&
      !!this.form?.get('contractReference')?.valid;
    const partiesValid = !!this.form?.get('counterpartyName')?.valid &&
      (!!this.form?.get('solicitor')?.value || !!this.form?.get('solicitorFirm')?.value);
    const termsValid = !!this.form?.get('keyTerms')?.value || !!this.form?.get('notes')?.value;

    return [
      { label: 'Contract Details', completed: detailsValid, active: !detailsValid },
      { label: 'Parties & Solicitor', completed: partiesValid, active: detailsValid && !partiesValid },
      { label: 'Terms & Notes', completed: termsValid, active: detailsValid && partiesValid && !termsValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(LegalActions.createContract({
      request: {
        ...value,
        contractValue: value.contractValue || undefined,
        counterpartyContact: value.counterpartyContact || undefined,
        solicitor: value.solicitor || undefined,
        solicitorFirm: value.solicitorFirm || undefined,
        solicitorEmail: value.solicitorEmail || undefined,
        keyTerms: value.keyTerms || undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
