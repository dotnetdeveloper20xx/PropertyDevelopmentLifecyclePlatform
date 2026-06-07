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
import * as OpportunitiesActions from '../../store/opportunities.actions';
import * as OpportunitiesSelectors from '../../store/opportunities.selectors';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent, FormFieldComponent
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
    ></app-page-description>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Section: Basic Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Opportunity Name" fieldId="name" [required]="true"
              [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Please enter a name for this opportunity (e.g., Riverside Development Site)' : undefined"
              hint="A descriptive name to identify this land opportunity">
              <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g., Riverside Development Site" />
            </app-form-field>

            <app-form-field label="Location" fieldId="location" [required]="true"
              [error]="form.get('location')?.touched && form.get('location')?.hasError('required') ? 'Please enter the location (e.g., London, UK or specific area)' : undefined"
              hint="City, area, or full address of the land">
              <input id="location" type="text" formControlName="location" class="input input-bordered w-full"
                [class.input-error]="form.get('location')?.invalid && form.get('location')?.touched"
                placeholder="e.g., Wandsworth, London" />
            </app-form-field>

            <app-form-field label="Land Size (Acres)" fieldId="landSize" [required]="true"
              [error]="form.get('landSize')?.touched && form.get('landSize')?.hasError('min') ? 'Land size must be a positive number (e.g., 2.5 acres)' : form.get('landSize')?.touched && form.get('landSize')?.hasError('required') ? 'Please enter the land area in acres' : undefined"
              hint="Total area of the land in acres">
              <input id="landSize" type="number" formControlName="landSize" class="input input-bordered w-full"
                [class.input-error]="form.get('landSize')?.invalid && form.get('landSize')?.touched"
                step="0.01" placeholder="e.g., 2.45" />
            </app-form-field>

            <app-form-field label="Asking Price (£)" fieldId="askingPrice"
              hint="The seller's listed price in GBP (optional at this stage)">
              <input id="askingPrice" type="number" formControlName="askingPrice" class="input input-bordered w-full"
                placeholder="e.g., 4500000" />
            </app-form-field>
          </div>

          <!-- Section: Source Information -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Source Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Source" fieldId="source"
              hint="How did you find this opportunity? (e.g., Agent Referral, Online Listing, Direct Contact)">
              <input id="source" type="text" formControlName="source" class="input input-bordered w-full"
                placeholder="e.g., Agent Referral" />
            </app-form-field>

            <app-form-field label="Agent Name" fieldId="agentName"
              hint="Name of the agent or broker (if applicable)">
              <input id="agentName" type="text" formControlName="agentName" class="input input-bordered w-full"
                placeholder="e.g., John Smith, ABC Properties" />
            </app-form-field>
          </div>

          <!-- Section: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Additional Notes</h3>
          <app-form-field label="Notes" fieldId="notes"
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

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(OpportunitiesActions.createOpportunity({ request: this.form.value }));
  }
}
