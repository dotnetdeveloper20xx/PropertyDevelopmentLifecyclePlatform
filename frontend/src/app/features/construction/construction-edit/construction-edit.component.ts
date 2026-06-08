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
import { ConstructionStageItem } from '../../../core/models/construction.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-construction-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if(loading){<app-loading-state message="Loading stage..."></app-loading-state>}
    @else if(item){
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Construction',url:'/construction'},{label:item.name,url:'/construction/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Construction Stage" [subtitle]="item.name"><a [routerLink]="['/construction',itemId]" class="btn btn-ghost btn-sm">← Back</a></app-page-header>
      <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Stage Name" fieldId="name" [required]="true" [error]="form.get('name')?.touched&&form.get('name')?.hasError('required')?'Required':undefined"><input id="name" type="text" formControlName="name" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Progress (%)" fieldId="progressPercent"><input id="progressPercent" type="number" formControlName="progressPercent" class="input input-bordered w-full" min="0" max="100"/></app-form-field>
            <app-form-field label="Planned Start" fieldId="plannedStartDate"><input id="plannedStartDate" type="date" formControlName="plannedStartDate" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Planned End" fieldId="plannedEndDate"><input id="plannedEndDate" type="date" formControlName="plannedEndDate" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Actual Start" fieldId="actualStartDate"><input id="actualStartDate" type="date" formControlName="actualStartDate" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Actual End" fieldId="actualEndDate"><input id="actualEndDate" type="date" formControlName="actualEndDate" class="input input-bordered w-full"/></app-form-field>
          </div>
          <app-form-field label="Description" fieldId="description"><textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"></textarea></app-form-field>
          <app-form-field label="Notes" fieldId="notes"><textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea></app-form-field>
          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a [routerLink]="['/construction',itemId]" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid||saving">@if(!saving){Save Changes}</button>
          </div>
        </form>
      </div></div>
    }@else{<div class="text-center p-8"><h3 class="text-lg font-semibold">Not Found</h3><a routerLink="/construction" class="btn btn-primary btn-sm mt-4">Back</a></div>}
  `
})
export class ConstructionEditComponent implements OnInit {
  item: ConstructionStageItem | null = null; loading = true; saving = false; itemId = ''; form!: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private http: HttpClient, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<ConstructionStageItem[]>>(`${environment.apiUrl}/construction`).subscribe({ next: (r) => { this.item = r.data.find(s => s.id === this.itemId) ?? null; if(this.item) this.buildForm(this.item); this.loading = false; this.cdr.markForCheck(); }, error: () => { this.loading = false; this.cdr.markForCheck(); } });
  }
  private buildForm(s: ConstructionStageItem): void {
    this.form = this.fb.group({ name: [s.name, Validators.required], progressPercent: [s.progressPercent], plannedStartDate: [s.plannedStartDate?.substring(0,10)], plannedEndDate: [s.plannedEndDate?.substring(0,10)], actualStartDate: [s.actualStartDate?.substring(0,10)], actualEndDate: [s.actualEndDate?.substring(0,10)], description: [s.description], notes: [s.notes] });
  }
  onSubmit(): void { if(this.form.invalid) return; this.saving = true; this.http.put(`${environment.apiUrl}/construction/${this.itemId}`, this.form.value).subscribe({ next: () => { this.toast.success('Stage updated'); this.router.navigate(['/construction', this.itemId]); }, error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0]??'Failed to update'); this.cdr.markForCheck(); } }); }
}
