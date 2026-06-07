import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, take } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PlanningApplicationDetail } from '../../../core/models/planning.model';
import * as PlanningActions from '../store/planning.actions';
import * as PlanningSelectors from '../store/planning.selectors';

@Component({
  selector: 'app-planning-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, LoadingStateComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Planning', url: '/planning'}, {label: 'Edit'}]"></app-breadcrumb>
    <app-page-header title="Edit Planning Application" subtitle="Update the details of this planning application">
      <a [routerLink]="['/planning', applicationId]" class="btn btn-ghost btn-sm">← Back to Detail</a>
    </app-page-header>

    @if (formLoading$ | async) {
      <app-loading-state message="Loading application details..."></app-loading-state>
    } @else if (form) {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Application Reference" fieldId="applicationReference" [required]="true">
                <input id="applicationReference" type="text" formControlName="applicationReference" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Local Authority" fieldId="localAuthority" [required]="true">
                <input id="localAuthority" type="text" formControlName="localAuthority" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Application Type" fieldId="applicationType" [required]="true">
                <select id="applicationType" formControlName="applicationType" class="select select-bordered w-full">
                  <option value="Full Planning">Full Planning</option>
                  <option value="Outline">Outline</option>
                  <option value="Reserved Matters">Reserved Matters</option>
                  <option value="Householder">Householder</option>
                  <option value="Listed Building Consent">Listed Building Consent</option>
                  <option value="Change of Use">Change of Use</option>
                  <option value="Prior Approval">Prior Approval</option>
                </select>
              </app-form-field>
              <app-form-field label="Planning Officer" fieldId="planningOfficer">
                <input id="planningOfficer" type="text" formControlName="planningOfficer" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Case Officer Email" fieldId="caseOfficerEmail">
                <input id="caseOfficerEmail" type="email" formControlName="caseOfficerEmail" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Ward" fieldId="ward">
                <input id="ward" type="text" formControlName="ward" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Site Address" fieldId="siteAddress">
                <input id="siteAddress" type="text" formControlName="siteAddress" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Application Fee (£)" fieldId="applicationFee">
                <input id="applicationFee" type="number" formControlName="applicationFee" class="input input-bordered w-full" step="0.01" />
              </app-form-field>
            </div>
            <app-form-field label="Description" fieldId="description" [required]="true">
              <textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>
            <app-form-field label="Notes" fieldId="notes">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>
            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/planning', applicationId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (saving$ | async)">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class PlanningEditComponent implements OnInit {
  form!: FormGroup;
  applicationId = '';
  formLoading$: Observable<boolean>;
  saving$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.formLoading$ = this.store.select(PlanningSelectors.selectSelectedLoading);
    this.saving$ = this.store.select(PlanningSelectors.selectPlanningLoading);
  }

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') ?? '';
    this.store.dispatch(PlanningActions.loadApplication({ id: this.applicationId }));

    this.store.select(PlanningSelectors.selectSelectedApplication).pipe(
      filter((app): app is PlanningApplicationDetail => app !== null),
      take(1)
    ).subscribe(app => {
      this.form = this.fb.group({
        applicationReference: [app.applicationReference, [Validators.required, Validators.maxLength(100)]],
        description: [app.description, [Validators.required, Validators.maxLength(2000)]],
        localAuthority: [app.localAuthority, [Validators.required, Validators.maxLength(200)]],
        applicationType: [app.applicationType, Validators.required],
        planningOfficer: [app.planningOfficer ?? ''],
        caseOfficerEmail: [app.caseOfficerEmail ?? ''],
        ward: [app.ward ?? ''],
        siteAddress: [app.siteAddress ?? ''],
        applicationFee: [app.applicationFee],
        notes: [app.notes ?? '']
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(PlanningActions.updateApplication({
      id: this.applicationId,
      request: { id: this.applicationId, ...this.form.value }
    }));
  }
}
