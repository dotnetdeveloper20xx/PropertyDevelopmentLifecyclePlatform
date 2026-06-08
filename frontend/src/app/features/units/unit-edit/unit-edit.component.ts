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
import { UnitItem } from '../../../core/models/unit.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Unit edit form. Loads existing unit data and allows modification via PUT.
 */
@Component({
  selector: 'app-unit-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent,
    FormFieldComponent, LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading unit..."></app-loading-state>
    } @else if (item) {
      <app-breadcrumb [items]="[
        { label: 'Home', url: '/dashboard' },
        { label: 'Units', url: '/units' },
        { label: item.reference, url: '/units/' + itemId },
        { label: 'Edit' }
      ]"></app-breadcrumb>

      <app-page-header title="Edit Unit" [subtitle]="item.reference">
        <a routerLink="/units" class="btn btn-ghost btn-sm">← Back to Units</a>
      </app-page-header>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- Unit Identity -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Unit Identity</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Reference" fieldId="reference" [required]="true"
                helpTooltip="Unique reference for this unit (e.g., A-101)"
                [error]="form.get('reference')?.touched && form.get('reference')?.hasError('required') ? 'Reference is required' : undefined">
                <input id="reference" type="text" formControlName="reference" class="input input-bordered w-full"
                  [class.input-error]="form.get('reference')?.invalid && form.get('reference')?.touched" />
              </app-form-field>
              <app-form-field label="Type" fieldId="type" [required]="true"
                helpTooltip="Type of property unit"
                [error]="form.get('type')?.touched && form.get('type')?.hasError('required') ? 'Type is required' : undefined">
                <select id="type" formControlName="type" class="select select-bordered w-full"
                  [class.select-error]="form.get('type')?.invalid && form.get('type')?.touched">
                  <option value="">Select type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Studio">Studio</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Parking">Parking</option>
                </select>
              </app-form-field>
              <app-form-field label="Floor" fieldId="floor"
                helpTooltip="Floor level (0 for ground, negative for basement)">
                <input id="floor" type="number" formControlName="floor" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <!-- Specifications -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Specifications</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Bedrooms" fieldId="bedrooms" [required]="true"
                helpTooltip="Number of bedrooms"
                [error]="form.get('bedrooms')?.touched && form.get('bedrooms')?.hasError('required') ? 'Bedrooms is required' : undefined">
                <input id="bedrooms" type="number" formControlName="bedrooms" class="input input-bordered w-full"
                  [class.input-error]="form.get('bedrooms')?.invalid && form.get('bedrooms')?.touched" min="0" />
              </app-form-field>
              <app-form-field label="Bathrooms" fieldId="bathrooms"
                helpTooltip="Number of bathrooms">
                <input id="bathrooms" type="number" formControlName="bathrooms" class="input input-bordered w-full" min="0" />
              </app-form-field>
              <app-form-field label="Area (sq ft)" fieldId="areaSqFt"
                helpTooltip="Total internal floor area in square feet">
                <input id="areaSqFt" type="number" formControlName="areaSqFt" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <!-- Pricing -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Pricing</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Price (£)" fieldId="price" [required]="true"
                helpTooltip="Asking or list price for this unit"
                [error]="form.get('price')?.touched && form.get('price')?.hasError('required') ? 'Price is required' : undefined">
                <input id="price" type="number" formControlName="price" class="input input-bordered w-full"
                  [class.input-error]="form.get('price')?.invalid && form.get('price')?.touched" step="0.01" />
              </app-form-field>
              <app-form-field label="Currency" fieldId="currency"
                helpTooltip="Currency code (defaults to GBP)">
                <input id="currency" type="text" formControlName="currency" class="input input-bordered w-full"
                  placeholder="GBP" />
              </app-form-field>
            </div>

            <!-- Notes -->
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Additional notes about this unit">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a routerLink="/units" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Unit Not Found</h3>
        <p class="text-base-content/60 mt-2">The requested unit could not be located.</p>
        <a routerLink="/units" class="btn btn-primary btn-sm mt-4">Back to Units</a>
      </div>
    }
  `
})
export class UnitEditComponent implements OnInit {
  item: UnitItem | null = null;
  loading = true;
  saving = false;
  itemId = '';
  form!: FormGroup;

  private readonly apiUrl = `${environment.apiUrl}/units`;

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
      this.http.get<ApiResponse<UnitItem[]>>(this.apiUrl).subscribe({
        next: (response) => {
          this.item = response.data.find(u => u.id === this.itemId) ?? null;
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

  private buildForm(unit: UnitItem): void {
    this.form = this.fb.group({
      reference: [unit.reference, Validators.required],
      type: [unit.type, Validators.required],
      floor: [unit.floor],
      bedrooms: [unit.bedrooms, [Validators.required, Validators.min(0)]],
      bathrooms: [unit.bathrooms],
      areaSqFt: [unit.areaSqFt],
      price: [unit.price, [Validators.required, Validators.min(0.01)]],
      currency: [unit.currency || 'GBP'],
      notes: [unit.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.put(`${this.apiUrl}/${this.itemId}`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Unit updated successfully');
        this.router.navigate(['/units']);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to update unit');
        this.cdr.markForCheck();
      }
    });
  }
}
