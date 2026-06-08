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
import { TransactionItem } from '../../../core/models/finance.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-finance-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if(loading){<app-loading-state message="Loading transaction..."></app-loading-state>}
    @else if(item){
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Finance',url:'/finance'},{label:item.description,url:'/finance/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Transaction" [subtitle]="item.description"><a [routerLink]="['/finance',itemId]" class="btn btn-ghost btn-sm">← Back</a></app-page-header>
      <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Description" fieldId="description" [required]="true"><input id="description" type="text" formControlName="description" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Type" fieldId="type" [required]="true"><select id="type" formControlName="type" class="select select-bordered w-full"><option value="Income">Income</option><option value="Expense">Expense</option><option value="Transfer">Transfer</option><option value="Adjustment">Adjustment</option></select></app-form-field>
            <app-form-field label="Amount" fieldId="amount" [required]="true"><input id="amount" type="number" formControlName="amount" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Currency" fieldId="currency"><input id="currency" type="text" formControlName="currency" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Reference" fieldId="reference"><input id="reference" type="text" formControlName="reference" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Transaction Date" fieldId="transactionDate"><input id="transactionDate" type="date" formControlName="transactionDate" class="input input-bordered w-full"/></app-form-field>
          </div>
          <app-form-field label="Notes" fieldId="notes"><textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea></app-form-field>
          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a [routerLink]="['/finance',itemId]" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid||saving">@if(!saving){Save Changes}</button>
          </div>
        </form>
      </div></div>
    }@else{<div class="text-center p-8"><h3 class="text-lg font-semibold">Not Found</h3><a routerLink="/finance" class="btn btn-primary btn-sm mt-4">Back</a></div>}
  `
})
export class FinanceEditComponent implements OnInit {
  item: TransactionItem | null = null; loading = true; saving = false; itemId = ''; form!: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private http: HttpClient, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<TransactionItem[]>>(`${environment.apiUrl}/finance`).subscribe({ next: (r) => { this.item = r.data.find(t => t.id === this.itemId) ?? null; if(this.item) this.buildForm(this.item); this.loading = false; this.cdr.markForCheck(); }, error: () => { this.loading = false; this.cdr.markForCheck(); } });
  }
  private buildForm(t: TransactionItem): void {
    this.form = this.fb.group({ description: [t.description, Validators.required], type: [t.type, Validators.required], amount: [t.amount, Validators.required], currency: [t.currency||'GBP'], reference: [t.reference], transactionDate: [t.transactionDate?.substring(0,10)], notes: [t.notes] });
  }
  onSubmit(): void { if(this.form.invalid) return; this.saving = true; this.http.put(`${environment.apiUrl}/finance/${this.itemId}`, this.form.value).subscribe({ next: () => { this.toast.success('Transaction updated'); this.router.navigate(['/finance', this.itemId]); }, error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0]??'Failed to update'); this.cdr.markForCheck(); } }); }
}
