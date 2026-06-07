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
import * as OpportunitiesActions from '../../store/opportunities.actions';
import * as OpportunitiesSelectors from '../../store/opportunities.selectors';

/**
 * Opportunity creation form with:
 * - Progress indicator showing section completion
 * - Contextual tooltips on each field ("?" icon with guidance)
 * - Help links to relevant articles
 * - Clear validation messages
 */
@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    FormFieldComponent, FormProgressComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Opportunities', url: '/opportunities'}, {label: 'Create New'}]"></app-breadcrumb>
    <app-page-header title="Create Land Opportunity" subtitle="Add a new potential development site to the pipeline">
      <a routerLink="/opportunities" class="btn btn-ghost btn-sm">← Back to Pipeline</a>
    </app-page-header>
    <app-page-description
      description="Fill in the details of a land opportunity you want to evaluate. Required fields are marked with an asterisk. The opportunity will be added at the 'Identified' stage and can be progressed through due diligence, offer, and acquisition."
      guidance="You can add more details later — only Name, Location, and Land Size are required to get started."
      helpLink="/help/getting-started/gs-first-opportunity"
    ></app-page-description>

    <!-- Progress Indicator -->
    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Section 1: Basic Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Basic Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Opportunity Name" fieldId="name" [required]="true"
              helpTooltip="A short, descriptive name that identifies this land site (e.g., 'Riverside 2.5 Acres, Wandsworth')"
              [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Please enter a name for this opportunity (e.g., Riverside Development Site)' : undefined"
              hint="A descriptive name to identify this land opportunity">
              <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g., Riverside Development Site" />
            </app-form-field>

            <app-form-field label="Location" fieldId="location" [required]="true"
              helpTooltip="The city, area, or full address. This is used for mapping and filtering in the pipeline view."
              [error]="form.get('location')?.touched && form.get('location')?.hasError('required') ? 'Please enter the location (e.g., London, UK or specific area)' : undefined"
              hint="City, area, or full address of the land">
              <input id="location" type="text" formControlName="location" class="input input-bordered w-full"
                [class.input-error]="form.get('location')?.invalid && form.get('location')?.touched"
                placeholder="e.g., Wandsworth, London" />
            </app-form-field>

            <app-form-field label="Land Size (Acres)" fieldId="landSize" [required]="true"
              helpTooltip="Total area in acres. Use decimals for precision (e.g., 2.45). This drives feasibility calculations later."
              helpLink="/help/land-acquisition/la-valuation"
              [error]="form.get('landSize')?.touched && form.get('landSize')?.hasError('min') ? 'Land size must be a positive number (e.g., 2.5 acres)' : form.get('landSize')?.touched && form.get('landSize')?.hasError('required') ? 'Please enter the land area in acres' : undefined"
              hint="Total area of the land in acres">
              <input id="landSize" type="number" formControlName="landSize" class="input input-bordered w-full"
                [class.input-error]="form.get('landSize')?.invalid && form.get('landSize')?.touched"
                step="0.01" placeholder="e.g., 2.45" />
            </app-form-field>

            <app-form-field label="Asking Price (£)" fieldId="askingPrice"
              helpTooltip="The seller's listed price in GBP. Optional at this stage — you can add it later after initial research."
              helpLink="/help/land-acquisition/la-valuation"
              hint="The seller's listed price in GBP (optional at this stage)">
              <input id="askingPrice" type="number" formControlName="askingPrice" class="input input-bordered w-full"
                placeholder="e.g., 4500000" />
            </app-form-field>
          </div>

          <!-- Section 2: Source Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            2. Source Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Source" fieldId="source"
              helpTooltip="How this opportunity was found. Helps track which channels produce the best leads (e.g., Agent Referral, Online Listing, Auction, Direct Contact)."
              hint="How did you find this opportunity? (e.g., Agent Referral, Online Listing, Direct Contact)">
              <input id="source" type="text" formControlName="source" class="input input-bordered w-full"
                placeholder="e.g., Agent Referral" />
            </app-form-field>

            <app-form-field label="Agent Name" fieldId="agentName"
              helpTooltip="The agent or broker who introduced this opportunity. Useful for maintaining relationships and tracking commissions."
              hint="Name of the agent or broker (if applicable)">
              <input id="agentName" type="text" formControlName="agentName" class="input input-bordered w-full"
                placeholder="e.g., John Smith, ABC Properties" />
            </app-form-field>
          </div>

          <!-- Section 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            3. Additional Notes
          </h3>
          <app-form-field label="Notes" fieldId="notes"
            helpTooltip="Free-text area for initial observations, access notes, or anything that helps evaluate this opportunity quickly."
            hint="Any additional context, observations, or initial assessment notes">
            <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"
              placeholder="e.g., Adjacent to existing development. Good transport links. Owner motivated to sell."></textarea>
          </app-form-field>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/opportunities" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Opportunity }
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- What happens next -->
    <div class="mt-6 p-4 bg-base-100 border border-base-300 rounded-lg">
      <h4 class="text-sm font-semibold text-base-content/70">What happens after you create this opportunity?</h4>
      <ol class="text-sm text-base-content/60 mt-2 list-decimal list-inside space-y-1">
        <li>The opportunity appears in your pipeline at the <strong>Identified</strong> stage</li>
        <li>You can add due diligence checks (legal, environmental, planning)</li>
        <li>When due diligence passes, you can progress to making an offer</li>
        <li>After the offer is accepted, you can manage the contract exchange and acquisition</li>
      </ol>
    </div>
  `
})
export class OpportunityFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      landSize: [null, [Validators.required, Validators.min(0.01)]],
      askingPrice: [null],
      source: [''],
      agentName: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesLoading);
    this.error$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesError);
  }

  /** Compute form progress steps based on section completion */
  formSteps(): FormStep[] {
    const nameValid = !!this.form?.get('name')?.valid && !!this.form?.get('location')?.valid && !!this.form?.get('landSize')?.valid;
    const sourceValid = !!this.form?.get('source')?.value || !!this.form?.get('agentName')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Basic Info', completed: nameValid, active: !nameValid },
      { label: 'Source', completed: sourceValid, active: nameValid && !sourceValid },
      { label: 'Notes', completed: notesValid, active: nameValid && sourceValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(OpportunitiesActions.createOpportunity({ request: this.form.value }));
  }
}
