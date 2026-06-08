import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ToastService } from '../../../core/services/toast.service';
import { ContractorItem } from '../../../core/models/contractor.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Edit contractor form. Loads existing data from list endpoint, allows modification, and saves via PUT.
 * Uses toast notifications for success/error feedback.
 */
@Component({
  selector: 'app-contractor-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent,
    FormFieldComponent, LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading contractor..."></app-loading-state>
    } @else if (item) {
      <app-breadcrumb [items]="[
        {label: 'Home', url: '/dashboard'},
        {label: 'Contractors', url: '/contractors'},
        {label: item.companyName, url: '/contractors/' + itemId},
        {label: 'Edit'}
      ]"></app-breadcrumb>
      <app-page-header title="Edit Contractor" [subtitle]="item.companyName">
        <a [routerLink]="['/contractors', itemId]" class="btn btn-ghost btn-sm">← Back to Details</a>
      </app-page-header>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Company Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Company Name" fieldId="companyName" [required]="true"
                [error]="form.get('companyName')?.touched && form.get('companyName')?.hasError('required') ? 'Company name is required' : undefined">
                <input id="companyName" type="text" formControlName="companyName" class="input input-bordered w-full"
                  [class.input-error]="form.get('companyName')?.invalid && form.get('companyName')?.touched" />
              </app-form-field>
              <app-form-field label="Type" fieldId="type" [required]="true"
                [error]="form.get('type')?.touched && form.get('type')?.hasError('required') ? 'Type is required' : undefined">
                <select id="type" formControlName="type" class="select select-bordered w-full"
                  [class.select-error]="form.get('type')?.invalid && form.get('type')?.touched">
                  <option value="">Select type</option>
                  <option value="MainContractor">Main Contractor</option>
                  <option value="Subcontractor">Subcontractor</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Specialist">Specialist</option>
                </select>
              </app-form-field>
              <app-form-field label="Trade" fieldId="trade">
                <input id="trade" type="text" formControlName="trade" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Contact Name" fieldId="contactName">
                <input id="contactName" type="text" formControlName="contactName" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Email" fieldId="email"
                [error]="form.get('email')?.touched && form.get('email')?.hasError('email') ? 'Please enter a valid email address' : undefined">
                <input id="email" type="email" formControlName="email" class="input input-bordered w-full"
                  [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched" />
              </app-form-field>
              <app-form-field label="Phone" fieldId="phone">
                <input id="phone" type="text" formControlName="phone" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Address" fieldId="address">
                <input id="address" type="text" formControlName="address" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Insurance & Certifications</h3>
            <div class="grid grid-cols-1 gap-4 mb-6">
              <app-form-field label="Insurance Details" fieldId="insuranceDetails">
                <textarea id="insuranceDetails" formControlName="insuranceDetails" class="textarea textarea-bordered w-full" rows="3"></textarea>
              </app-form-field>
              <app-form-field label="Certifications" fieldId="certifications">
                <textarea id="certifications" formControlName="certifications" class="textarea textarea-bordered w-full" rows="3"></textarea>
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
            <app-form-field label="Notes" fieldId="notes">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/contractors', itemId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Contractor Not Found</h3>
        <a routerLink="/contractors" class="btn btn-primary btn-sm mt-4">Back to Contractors</a>
      </div>
    }
  `
})
export class ContractorEditComponent implements OnInit {
  item: ContractorItem | null = null;
  loading = true;
  saving = false;
  itemId = '';
  form!: FormGroup;

  private readonly apiUrl = `${environment.apiUrl}/contractors`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.itemId) {
      this.http.get<ApiResponse<ContractorItem[]>>(this.apiUrl).subscribe({
        next: (response) => {
          this.item = response.data.find(c => c.id === this.itemId) ?? null;
          if (this.item) {
            this.buildForm(this.item);
          }
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

  private buildForm(contractor: ContractorItem): void {
    this.form = this.fb.group({
      companyName: [contractor.companyName, Validators.required],
      type: [contractor.type, Validators.required],
      trade: [contractor.trade],
      contactName: [contractor.contactName],
      email: [contractor.email, Validators.email],
      phone: [contractor.phone],
      address: [contractor.address],
      insuranceDetails: [contractor.insuranceDetails],
      certifications: [contractor.certifications],
      notes: [contractor.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.put(`${this.apiUrl}/${this.itemId}`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Contractor updated successfully');
        this.router.navigate(['/contractors', this.itemId]);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to update contractor');
        this.cdr.markForCheck();
      }
    });
  }
}
