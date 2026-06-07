import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { OpportunityService } from '../../../../core/services/opportunity.service';
import { ToastService } from '../../../../core/services/toast.service';
import { OpportunityDetail } from '../../../../core/models/opportunity.model';

/**
 * Edit opportunity form. Loads existing data, allows modification, and saves via PUT.
 * Uses toast notifications for success/error feedback.
 */
@Component({
  selector: 'app-opportunity-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    FormFieldComponent, LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading opportunity..."></app-loading-state>
    } @else if (opportunity) {
      <app-breadcrumb [items]="[
        {label: 'Home', url: '/dashboard'},
        {label: 'Opportunities', url: '/opportunities'},
        {label: opportunity.name, url: '/opportunities/' + opportunityId},
        {label: 'Edit'}
      ]"></app-breadcrumb>
      <app-page-header title="Edit Opportunity" [subtitle]="opportunity.name">
        <a [routerLink]="['/opportunities', opportunityId]" class="btn btn-ghost btn-sm">← Back to Details</a>
      </app-page-header>
      <app-page-description
        description="Update the details of this land opportunity. Changes are saved immediately when you click Save."
        guidance="All fields can be modified. Required fields are marked with an asterisk."
      ></app-page-description>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Land Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Opportunity Name" fieldId="name" [required]="true"
                helpTooltip="A descriptive name for this land site"
                [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Name is required' : undefined">
                <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                  [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched" />
              </app-form-field>
              <app-form-field label="Location" fieldId="location" [required]="true"
                [error]="form.get('location')?.touched && form.get('location')?.hasError('required') ? 'Location is required' : undefined">
                <input id="location" type="text" formControlName="location" class="input input-bordered w-full"
                  [class.input-error]="form.get('location')?.invalid && form.get('location')?.touched" />
              </app-form-field>
              <app-form-field label="Land Size (Acres)" fieldId="landSize" [required]="true"
                [error]="form.get('landSize')?.touched && form.get('landSize')?.hasError('min') ? 'Must be positive' : form.get('landSize')?.touched && form.get('landSize')?.hasError('required') ? 'Required' : undefined">
                <input id="landSize" type="number" formControlName="landSize" class="input input-bordered w-full" step="0.01" />
              </app-form-field>
              <app-form-field label="Asking Price (£)" fieldId="askingPrice">
                <input id="askingPrice" type="number" formControlName="askingPrice" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Estimated Value (£)" fieldId="estimatedValue">
                <input id="estimatedValue" type="number" formControlName="estimatedValue" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Est. Development Cost (£)" fieldId="estimatedDevelopmentCost">
                <input id="estimatedDevelopmentCost" type="number" formControlName="estimatedDevelopmentCost" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Location & Planning</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Address" fieldId="address">
                <input id="address" type="text" formControlName="address" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Post Code" fieldId="postCode">
                <input id="postCode" type="text" formControlName="postCode" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Current Use" fieldId="currentUse">
                <input id="currentUse" type="text" formControlName="currentUse" class="input input-bordered w-full" placeholder="e.g., Agricultural, Brownfield" />
              </app-form-field>
              <app-form-field label="Title Number" fieldId="titleNumber">
                <input id="titleNumber" type="text" formControlName="titleNumber" class="input input-bordered w-full" placeholder="e.g., LN123456" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Source & Agent</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Source" fieldId="source">
                <input id="source" type="text" formControlName="source" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Agent Name" fieldId="agentName">
                <input id="agentName" type="text" formControlName="agentName" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
            <app-form-field label="Notes" fieldId="notes">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/opportunities', opportunityId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Opportunity Not Found</h3>
        <a routerLink="/opportunities" class="btn btn-primary btn-sm mt-4">Back to Opportunities</a>
      </div>
    }
  `
})
export class OpportunityEditComponent implements OnInit {
  opportunity: OpportunityDetail | null = null;
  loading = true;
  saving = false;
  opportunityId = '';
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.opportunityId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.opportunityId) {
      this.opportunityService.getById(this.opportunityId).subscribe({
        next: (response) => {
          this.opportunity = response.data;
          this.buildForm(response.data);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loading = false;
    }
  }

  private buildForm(opp: OpportunityDetail): void {
    this.form = this.fb.group({
      name: [opp.name, Validators.required],
      location: [opp.location, Validators.required],
      landSize: [opp.landSize, [Validators.required, Validators.min(0.01)]],
      askingPrice: [opp.askingPrice],
      estimatedValue: [opp.estimatedValue],
      estimatedDevelopmentCost: [opp.estimatedDevelopmentCost],
      address: [opp.address],
      postCode: [opp.postCode],
      currentUse: [opp.currentUse],
      titleNumber: [opp.titleNumber],
      source: [opp.source],
      agentName: [opp.agentName],
      notes: [opp.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.opportunityService.update(this.opportunityId, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Opportunity updated successfully');
        this.router.navigate(['/opportunities', this.opportunityId]);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to update opportunity');
        this.cdr.markForCheck();
      }
    });
  }
}
