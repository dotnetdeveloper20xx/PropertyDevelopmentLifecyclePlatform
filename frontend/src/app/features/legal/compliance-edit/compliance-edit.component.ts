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
import { ComplianceCheckItem } from '../../../core/models/legal.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-compliance-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if(loading){<app-loading-state message="Loading compliance check..."></app-loading-state>}
    @else if(item){
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Compliance',url:'/legal/compliance'},{label:item.checkType,url:'/legal/compliance/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Compliance Check" [subtitle]="item.checkType"><a [routerLink]="['/legal/compliance',itemId]" class="btn btn-ghost btn-sm">← Back</a></app-page-header>
      <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Assigned To" fieldId="assignedTo"><input id="assignedTo" type="text" formControlName="assignedTo" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Due Date" fieldId="dueDate"><input id="dueDate" type="date" formControlName="dueDate" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Outcome" fieldId="outcome"><input id="outcome" type="text" formControlName="outcome" class="input input-bordered w-full" placeholder="e.g., Passed, Further review needed"/></app-form-field>
          </div>
          <app-form-field label="Notes" fieldId="notes"><textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="3"></textarea></app-form-field>
          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a [routerLink]="['/legal/compliance',itemId]" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid||saving">@if(!saving){Save Changes}</button>
          </div>
        </form>
      </div></div>
    }@else{<div class="text-center p-8"><h3 class="text-lg font-semibold">Not Found</h3><a routerLink="/legal/compliance" class="btn btn-primary btn-sm mt-4">Back</a></div>}
  `
})
export class ComplianceEditComponent implements OnInit {
  item: ComplianceCheckItem | null = null; loading = true; saving = false; itemId = ''; form!: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private http: HttpClient, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<ComplianceCheckItem[]>>(`${environment.apiUrl}/legal/compliance`).subscribe({
      next: (r) => { this.item = r.data.find(c => c.id === this.itemId) ?? null; if(this.item) this.buildForm(this.item); this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }
  private buildForm(c: ComplianceCheckItem): void {
    this.form = this.fb.group({ assignedTo: [c.assignedTo], dueDate: [c.dueDate?.substring(0,10)], outcome: [c.outcome], notes: [c.notes] });
  }
  onSubmit(): void {
    if(this.form.invalid) return; this.saving = true;
    this.http.put(`${environment.apiUrl}/legal/compliance/${this.itemId}`, this.form.value).subscribe({
      next: () => { this.toast.success('Compliance check updated'); this.router.navigate(['/legal/compliance', this.itemId]); },
      error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0]??'Failed to update'); this.cdr.markForCheck(); }
    });
  }
}
