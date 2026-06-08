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
import { DefectItem } from '../../../core/models/defect.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-defect-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if(loading){<app-loading-state message="Loading defect..."></app-loading-state>}
    @else if(item){
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Defects',url:'/defects'},{label:item.title,url:'/defects/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Defect" [subtitle]="item.title"><a [routerLink]="['/defects',itemId]" class="btn btn-ghost btn-sm">← Back</a></app-page-header>
      <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Title" fieldId="title" [required]="true" [error]="form.get('title')?.touched&&form.get('title')?.hasError('required')?'Required':undefined"><input id="title" type="text" formControlName="title" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Priority" fieldId="priority" [required]="true"><select id="priority" formControlName="priority" class="select select-bordered w-full"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option></select></app-form-field>
            <app-form-field label="Location" fieldId="location"><input id="location" type="text" formControlName="location" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Unit Reference" fieldId="unitReference"><input id="unitReference" type="text" formControlName="unitReference" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Assigned To" fieldId="assignedTo"><input id="assignedTo" type="text" formControlName="assignedTo" class="input input-bordered w-full"/></app-form-field>
          </div>
          <app-form-field label="Description" fieldId="description"><textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"></textarea></app-form-field>
          <app-form-field label="Notes" fieldId="notes"><textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea></app-form-field>
          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a [routerLink]="['/defects',itemId]" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid||saving">@if(!saving){Save Changes}</button>
          </div>
        </form>
      </div></div>
    }@else{<div class="card bg-base-100 p-8 text-center"><h3 class="text-lg font-semibold">Defect Not Found</h3><a routerLink="/defects" class="btn btn-primary btn-sm mt-4">Back</a></div>}
  `
})
export class DefectEditComponent implements OnInit {
  item: DefectItem | null = null; loading = true; saving = false; itemId = ''; form!: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private http: HttpClient, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<DefectItem[]>>(`${environment.apiUrl}/defects`).subscribe({ next: (r) => { this.item = r.data.find(d => d.id === this.itemId) ?? null; if(this.item) this.buildForm(this.item); this.loading = false; this.cdr.markForCheck(); }, error: () => { this.loading = false; this.cdr.markForCheck(); } });
  }
  private buildForm(d: DefectItem): void {
    this.form = this.fb.group({ title: [d.title, Validators.required], priority: [d.priority, Validators.required], location: [d.location], unitReference: [d.unitReference], assignedTo: [d.assignedTo], description: [d.description], notes: [d.notes] });
  }
  onSubmit(): void {
    if(this.form.invalid) return; this.saving = true;
    this.http.put(`${environment.apiUrl}/defects/${this.itemId}`, this.form.value).subscribe({ next: () => { this.toast.success('Defect updated'); this.router.navigate(['/defects', this.itemId]); }, error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0]??'Failed to update'); this.cdr.markForCheck(); } });
  }
}
