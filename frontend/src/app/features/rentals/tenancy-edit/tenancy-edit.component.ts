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
import { TenancyItem } from '../../../core/models/rental.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Edit tenancy form. Loads existing data from list endpoint, allows modification, and saves via PUT.
 * Uses toast notifications for success/error feedback.
 */
@Component({
  selector: 'app-tenancy-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent,
    FormFieldComponent, LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading tenancy..."></app-loading-state>
    } @else if (item) {
      <app-breadcrumb [items]="[
        {label: 'Home', url: '/dashboard'},
        {label: 'Rentals', url: '/rentals'},
        {label: item.tenantName, url: '/rentals/' + itemId},
        {label: 'Edit'}
      ]"></app-breadcrumb>
      <app-page-header title="Edit Tenancy" [subtitle]="item.tenantName">
        <a [routerLink]="['/rentals', itemId]" class="btn btn-ghost btn-sm">← Back to Details</a>
      </app-page-header>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Tenant Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Tenant Name" fieldId="tenantName" [required]="true"
                [error]="form.get('tenantName')?.touched && form.get('tenantName')?.hasError('required') ? 'Tenant name is required' : undefined">
                <input id="tenantName" type="text" formControlName="tenantName" class="input input-bordered w-full"
                  [class.input-error]="form.get('tenantName')?.invalid && form.get('tenantName')?.touched" />
              </app-form-field>
              <app-form-field label="Tenant Email" fieldId="tenantEmail"
                [error]="form.get('tenantEmail')?.touched && form.get('tenantEmail')?.hasError('email') ? 'Please enter a valid email address' : undefined">
                <input id="tenantEmail" type="email" formControlName="tenantEmail" class="input input-bordered w-full"
                  [class.input-error]="form.get('tenantEmail')?.invalid && form.get('tenantEmail')?.touched" />
              </app-form-field>
              <app-form-field label="Tenant Phone" fieldId="tenantPhone">
                <input id="tenantPhone" type="text" formControlName="tenantPhone" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Rent Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Rent Amount" fieldId="rentAmount" [required]="true"
                [error]="form.get('rentAmount')?.touched && form.get('rentAmount')?.hasError('required') ? 'Rent amount is required' : form.get('rentAmount')?.touched && form.get('rentAmount')?.hasError('min') ? 'Must be zero or greater' : undefined">
                <input id="rentAmount" type="number" formControlName="rentAmount" class="input input-bordered w-full" step="0.01"
                  [class.input-error]="form.get('rentAmount')?.invalid && form.get('rentAmount')?.touched" />
              </app-form-field>
              <app-form-field label="Currency" fieldId="currency">
                <input id="currency" type="text" formControlName="currency" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Rent Frequency" fieldId="rentFrequency" [required]="true"
                [error]="form.get('rentFrequency')?.touched && form.get('rentFrequency')?.hasError('required') ? 'Rent frequency is required' : undefined">
                <select id="rentFrequency" formControlName="rentFrequency" class="select select-bordered w-full"
                  [class.select-error]="form.get('rentFrequency')?.invalid && form.get('rentFrequency')?.touched">
                  <option value="">Select frequency</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </app-form-field>
              <app-form-field label="Deposit Amount" fieldId="depositAmount">
                <input id="depositAmount" type="number" formControlName="depositAmount" class="input input-bordered w-full" step="0.01" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Tenancy Dates</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Start Date" fieldId="startDate" [required]="true"
                [error]="form.get('startDate')?.touched && form.get('startDate')?.hasError('required') ? 'Start date is required' : undefined">
                <input id="startDate" type="date" formControlName="startDate" class="input input-bordered w-full"
                  [class.input-error]="form.get('startDate')?.invalid && form.get('startDate')?.touched" />
              </app-form-field>
              <app-form-field label="End Date" fieldId="endDate">
                <input id="endDate" type="date" formControlName="endDate" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
            <app-form-field label="Notes" fieldId="notes">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/rentals', itemId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Tenancy Not Found</h3>
        <a routerLink="/rentals" class="btn btn-primary btn-sm mt-4">Back to Rentals</a>
      </div>
    }
  `
})
export class TenancyEditComponent implements OnInit {
  item: TenancyItem | null = null;
  loading = true;
  saving = false;
  itemId = '';
  form!: FormGroup;

  private readonly apiUrl = `${environment.apiUrl}/rentals`;

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
      this.http.get<ApiResponse<TenancyItem[]>>(this.apiUrl).subscribe({
        next: (response) => {
          this.item = response.data.find(t => t.id === this.itemId) ?? null;
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

  private buildForm(tenancy: TenancyItem): void {
    this.form = this.fb.group({
      tenantName: [tenancy.tenantName, Validators.required],
      tenantEmail: [tenancy.tenantEmail, Validators.email],
      tenantPhone: [tenancy.tenantPhone],
      rentAmount: [tenancy.rentAmount, [Validators.required, Validators.min(0)]],
      currency: [tenancy.currency || 'GBP'],
      rentFrequency: [tenancy.rentFrequency, Validators.required],
      startDate: [tenancy.startDate ? tenancy.startDate.substring(0, 10) : '', Validators.required],
      endDate: [tenancy.endDate ? tenancy.endDate.substring(0, 10) : ''],
      depositAmount: [tenancy.depositAmount],
      notes: [tenancy.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.put(`${this.apiUrl}/${this.itemId}`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Tenancy updated successfully');
        this.router.navigate(['/rentals', this.itemId]);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to update tenancy');
        this.cdr.markForCheck();
      }
    });
  }
}
