import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { ToastService } from '../../../../core/services/toast.service';
import { ContractDetail } from '../../../../core/models/legal.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-contract-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading contract..."></app-loading-state>
    } @else if (item) {
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Contracts',url:'/legal/contracts'},{label:item.title,url:'/legal/contracts/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Contract" [subtitle]="item.title">
        <a [routerLink]="['/legal/contracts', itemId]" class="btn btn-ghost btn-sm">← Back to Details</a>
      </app-page-header>

      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Contract Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Title" fieldId="title" [required]="true"
                [error]="form.get('title')?.touched && form.get('title')?.hasError('required') ? 'Title is required' : undefined">
                <input id="title" type="text" formControlName="title" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Contract Reference" fieldId="contractReference" [required]="true">
                <input id="contractReference" type="text" formControlName="contractReference" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Counterparty Name" fieldId="counterpartyName" [required]="true">
                <input id="counterpartyName" type="text" formControlName="counterpartyName" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Counterparty Contact" fieldId="counterpartyContact">
                <input id="counterpartyContact" type="text" formControlName="counterpartyContact" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Contract Value (£)" fieldId="contractValue">
                <input id="contractValue" type="number" formControlName="contractValue" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Solicitor Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Solicitor" fieldId="solicitor">
                <input id="solicitor" type="text" formControlName="solicitor" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Solicitor Firm" fieldId="solicitorFirm">
                <input id="solicitorFirm" type="text" formControlName="solicitorFirm" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="Solicitor Email" fieldId="solicitorEmail">
                <input id="solicitorEmail" type="email" formControlName="solicitorEmail" class="input input-bordered w-full" />
              </app-form-field>
            </div>

            <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">Dates & Terms</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <app-form-field label="Start Date" fieldId="startDate">
                <input id="startDate" type="date" formControlName="startDate" class="input input-bordered w-full" />
              </app-form-field>
              <app-form-field label="End Date" fieldId="endDate">
                <input id="endDate" type="date" formControlName="endDate" class="input input-bordered w-full" />
              </app-form-field>
            </div>
            <app-form-field label="Key Terms" fieldId="keyTerms">
              <textarea id="keyTerms" formControlName="keyTerms" class="textarea textarea-bordered w-full" rows="3"></textarea>
            </app-form-field>
            <app-form-field label="Notes" fieldId="notes">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea>
            </app-form-field>

            <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
              <a [routerLink]="['/legal/contracts', itemId]" class="btn btn-ghost">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">
                @if (!saving) { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <h3 class="text-lg font-semibold">Contract Not Found</h3>
        <a routerLink="/legal/contracts" class="btn btn-primary btn-sm mt-4">Back to Contracts</a>
      </div>
    }
  `
})
export class ContractEditComponent implements OnInit {
  item: ContractDetail | null = null;
  loading = true;
  saving = false;
  itemId = '';
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private fb: FormBuilder, private http: HttpClient,
    private toast: ToastService, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<ContractDetail>>(`${environment.apiUrl}/contracts/${this.itemId}`).subscribe({
      next: (r) => { this.item = r.data; this.buildForm(r.data); this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  private buildForm(c: ContractDetail): void {
    this.form = this.fb.group({
      title: [c.title, Validators.required],
      contractReference: [c.contractReference, Validators.required],
      counterpartyName: [c.counterpartyName, Validators.required],
      counterpartyContact: [c.counterpartyContact],
      contractValue: [c.contractValue],
      solicitor: [c.solicitor],
      solicitorFirm: [c.solicitorFirm],
      solicitorEmail: [c.solicitorEmail],
      startDate: [c.startDate?.substring(0, 10)],
      endDate: [c.endDate?.substring(0, 10)],
      keyTerms: [c.keyTerms],
      notes: [c.notes]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.put(`${environment.apiUrl}/contracts/${this.itemId}`, this.form.value).subscribe({
      next: () => { this.toast.success('Contract updated successfully'); this.router.navigate(['/legal/contracts', this.itemId]); },
      error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0] ?? 'Failed to update contract'); this.cdr.markForCheck(); }
    });
  }
}
