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
import { PurchaseOrderItem } from '../../../core/models/procurement.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-procurement-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if(loading){<app-loading-state message="Loading purchase order..."></app-loading-state>}
    @else if(item){
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Procurement',url:'/procurement'},{label:item.orderReference,url:'/procurement/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Purchase Order" [subtitle]="item.orderReference"><a [routerLink]="['/procurement',itemId]" class="btn btn-ghost btn-sm">← Back</a></app-page-header>
      <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Order Reference" fieldId="orderReference" [required]="true"><input id="orderReference" type="text" formControlName="orderReference" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Supplier Name" fieldId="supplierName" [required]="true"><input id="supplierName" type="text" formControlName="supplierName" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Supplier Contact" fieldId="supplierContact"><input id="supplierContact" type="text" formControlName="supplierContact" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Total Value" fieldId="totalValue" [required]="true"><input id="totalValue" type="number" formControlName="totalValue" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Expected Delivery" fieldId="expectedDeliveryDate"><input id="expectedDeliveryDate" type="date" formControlName="expectedDeliveryDate" class="input input-bordered w-full"/></app-form-field>
          </div>
          <app-form-field label="Description" fieldId="description"><textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"></textarea></app-form-field>
          <app-form-field label="Notes" fieldId="notes"><textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea></app-form-field>
          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a [routerLink]="['/procurement',itemId]" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid||saving">@if(!saving){Save Changes}</button>
          </div>
        </form>
      </div></div>
    }@else{<div class="text-center p-8"><h3 class="text-lg font-semibold">Not Found</h3><a routerLink="/procurement" class="btn btn-primary btn-sm mt-4">Back</a></div>}
  `
})
export class ProcurementEditComponent implements OnInit {
  item: PurchaseOrderItem | null = null; loading = true; saving = false; itemId = ''; form!: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private http: HttpClient, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<PurchaseOrderItem[]>>(`${environment.apiUrl}/procurement`).subscribe({ next: (r) => { this.item = r.data.find(o => o.id === this.itemId) ?? null; if(this.item) this.buildForm(this.item); this.loading = false; this.cdr.markForCheck(); }, error: () => { this.loading = false; this.cdr.markForCheck(); } });
  }
  private buildForm(o: PurchaseOrderItem): void {
    this.form = this.fb.group({ orderReference: [o.orderReference, Validators.required], supplierName: [o.supplierName, Validators.required], supplierContact: [o.supplierContact], totalValue: [o.totalValue, Validators.required], expectedDeliveryDate: [o.expectedDeliveryDate?.substring(0,10)], description: [o.description], notes: [o.notes] });
  }
  onSubmit(): void { if(this.form.invalid) return; this.saving = true; this.http.put(`${environment.apiUrl}/procurement/${this.itemId}`, this.form.value).subscribe({ next: () => { this.toast.success('Purchase order updated'); this.router.navigate(['/procurement', this.itemId]); }, error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0]??'Failed to update'); this.cdr.markForCheck(); } }); }
}
