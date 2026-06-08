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
import { InvestorItem } from '../../../core/models/investor.model';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Edit investor form. Loads existing data from list endpoint, allows modification, and saves via PUT.
 * Uses toast notifications for success/error feedback.
 */
@Component({
  selector: 'app-investor-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent,
    FormFieldComponent, LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading investor..."></app-loading-state>
    } @else if (item) {
      <app-breadcrumb [items]="[
        {label: 'Home', url: '/dashboard'},
        {label: 'Investors', url: '/investors'},
        {label: item.name, url: '/investors/' + itemId},
        {label: 'Edit'}
      ]"></app-breadcrumb>
      <app-page-header title="Edit Investor" [subtitle]="item.name">
        <a [routerLink]="['/investors', itemId]" class="btn btn-ghost btn-sm">← Back to Details</a>
      </app-page-header>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Investor Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Name" fieldId="name" [required]="true"
                [error]="form.get('name')?.touched && form.get('name')?.hasError('required') ? 'Name is required' : undefined">
                <input id="name" type="text" formControlName="name" class="input input-bordered w-full"
                  [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched" />
              </app-form-field>
              <app-form-field label="Type" fieldId="type" [required]="true"
                [error]="form.get('type')?.touched && form.get('type')?.hasError('required') ? 'Type is required' : undefined">
                <select id="type" formControlName="type" class="select select-bordered w-full"
                  [class.select-error]="form.get('type')?.invalid && form.get('type')?.touched">
                  <option value="">Select type</option>
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Institutional">Institutional</option>
                  <option value="FamilyOffice">Family Office</option>
                  <option value="REIT">REIT</option>
                </select>
              </app-form-field>
              <app-form-field label="Company" fieldId="company">
                <input id="company" type="text" formControlName="company" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Email" fieldId="email"
                [error]="form.get('email')?.touched && form.get('email')?.hasError('email') ? 'Please enter a valid email address' : undefined">
                <input id="email" type="email" formControlName="email" class="input input-bordered w-full"
                  [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched" />
              </app-form-field>
              <app-form-field label="Phone" fieldId="phone">
                <input id="phone" type="text" formControlName="phone" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Financial Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Total Invested" fieldId="totalInvested">
                <input id="totalInvested" type="number" formControlName="totalInvested" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Currency" fieldId="currency">
                <input id="currency" type="text" formControlName="currency" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Notes</h3>
            <app-form-field label="Notes" fieldId="notes">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/investors', itemId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving" [class.loading]="saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Investor Not Found</h3>
        <a routerLink="/investors" class="btn btn-primary btn-sm mt-4">Back to Investors</a>
      </div>
    }
  `
})
export class InvestorEditComponent implements OnInit {
  item: InvestorItem | null = null;
  loading = true;
  saving = false;
  itemId = '';
  form!: FormGroup;

  private readonly apiUrl = `${environment.apiUrl}/investors`;

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
      this.http.get<ApiResponse<InvestorItem[]>>(this.apiUrl).subscribe({
        next: (response) => {
          this.item = response.data.find(i => i.id === this.itemId) ?? null;
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

  private buildForm(investor: InvestorItem): void {
    this.form = this.fb.group({
      name: [investor.name, Validators.required],
      type: [investor.type, Validators.required],
      company: [investor.company],
      email: [investor.email, Validators.email],
      phone: [investor.phone],
      totalInvested: [investor.totalInvested],
      currency: [investor.currency || 'GBP'],
      notes: [investor.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.put(`${this.apiUrl}/${this.itemId}`, this.form.value).subscribe({
      next: () => {
        this.toastService.success('Investor updated successfully');
        this.router.navigate(['/investors', this.itemId]);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.errors?.[0] ?? 'Failed to update investor');
        this.cdr.markForCheck();
      }
    });
  }
}
