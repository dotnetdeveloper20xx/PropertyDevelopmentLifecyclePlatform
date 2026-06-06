import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import * as OpportunitiesActions from '../../store/opportunities.actions';
import * as OpportunitiesSelectors from '../../store/opportunities.selectors';

/**
 * Opportunity create form. Container component — dispatches create action to NgRx store.
 * Navigation on success handled by NgRx effect.
 */
@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="New Opportunity" subtitle="Add a land opportunity to the pipeline">
      <a routerLink="/opportunities" class="btn btn-ghost btn-sm">← Back</a>
    </app-page-header>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label" for="name"><span class="label-text">Name *</span></label>
              <input id="name" type="text" formControlName="name" class="input input-bordered"
                [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                placeholder="e.g. Riverside Land" />
              @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                <label class="label"><span class="label-text-alt text-error">Name is required</span></label>
              }
            </div>

            <div class="form-control">
              <label class="label" for="location"><span class="label-text">Location *</span></label>
              <input id="location" type="text" formControlName="location" class="input input-bordered"
                [class.input-error]="form.get('location')?.invalid && form.get('location')?.touched"
                placeholder="e.g. London, UK" />
              @if (form.get('location')?.hasError('required') && form.get('location')?.touched) {
                <label class="label"><span class="label-text-alt text-error">Location is required</span></label>
              }
            </div>

            <div class="form-control">
              <label class="label" for="landSize"><span class="label-text">Land Size (Acres) *</span></label>
              <input id="landSize" type="number" formControlName="landSize" class="input input-bordered"
                [class.input-error]="form.get('landSize')?.invalid && form.get('landSize')?.touched"
                step="0.01" />
              @if (form.get('landSize')?.hasError('min') && form.get('landSize')?.touched) {
                <label class="label"><span class="label-text-alt text-error">Must be greater than 0</span></label>
              }
            </div>

            <div class="form-control">
              <label class="label" for="askingPrice"><span class="label-text">Asking Price (£)</span></label>
              <input id="askingPrice" type="number" formControlName="askingPrice" class="input input-bordered" />
            </div>

            <div class="form-control">
              <label class="label" for="source"><span class="label-text">Source</span></label>
              <input id="source" type="text" formControlName="source" class="input input-bordered"
                placeholder="e.g. Agent Referral" />
            </div>

            <div class="form-control">
              <label class="label" for="agentName"><span class="label-text">Agent Name</span></label>
              <input id="agentName" type="text" formControlName="agentName" class="input input-bordered" />
            </div>
          </div>

          <div class="form-control mt-4">
            <label class="label" for="notes"><span class="label-text">Notes</span></label>
            <textarea id="notes" formControlName="notes" class="textarea textarea-bordered" rows="3"></textarea>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6">
            <a routerLink="/opportunities" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Opportunity }
            </button>
          </div>
        </form>
      </div>
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
