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
import { DesignPackageItem } from '../../../core/models/design.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-design-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, FormFieldComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if(loading){<app-loading-state message="Loading design package..."></app-loading-state>}
    @else if(item){
      <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Design',url:'/design'},{label:item.name,url:'/design/'+itemId},{label:'Edit'}]"></app-breadcrumb>
      <app-page-header title="Edit Design Package" [subtitle]="item.name"><a [routerLink]="['/design',itemId]" class="btn btn-ghost btn-sm">← Back</a></app-page-header>
      <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Name" fieldId="name" [required]="true" [error]="form.get('name')?.touched&&form.get('name')?.hasError('required')?'Required':undefined"><input id="name" type="text" formControlName="name" class="input input-bordered w-full"/></app-form-field>
            <app-form-field label="Discipline" fieldId="discipline"><input id="discipline" type="text" formControlName="discipline" class="input input-bordered w-full" placeholder="e.g., Architecture, Structural"/></app-form-field>
            <app-form-field label="Consultant" fieldId="consultant"><input id="consultant" type="text" formControlName="consultant" class="input input-bordered w-full"/></app-form-field>
          </div>
          <app-form-field label="Description" fieldId="description"><textarea id="description" formControlName="description" class="textarea textarea-bordered w-full" rows="3"></textarea></app-form-field>
          <app-form-field label="Notes" fieldId="notes"><textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="2"></textarea></app-form-field>
          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a [routerLink]="['/design',itemId]" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid||saving">@if(!saving){Save Changes}</button>
          </div>
        </form>
      </div></div>
    }@else{<div class="text-center p-8"><h3 class="text-lg font-semibold">Not Found</h3><a routerLink="/design" class="btn btn-primary btn-sm mt-4">Back</a></div>}
  `
})
export class DesignEditComponent implements OnInit {
  item: DesignPackageItem | null = null; loading = true; saving = false; itemId = ''; form!: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private http: HttpClient, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<DesignPackageItem[]>>(`${environment.apiUrl}/design`).subscribe({ next: (r) => { this.item = r.data.find(d => d.id === this.itemId) ?? null; if(this.item) this.buildForm(this.item); this.loading = false; this.cdr.markForCheck(); }, error: () => { this.loading = false; this.cdr.markForCheck(); } });
  }
  private buildForm(d: DesignPackageItem): void { this.form = this.fb.group({ name: [d.name, Validators.required], discipline: [d.discipline], consultant: [d.consultant], description: [d.description], notes: [d.notes] }); }
  onSubmit(): void { if(this.form.invalid) return; this.saving = true; this.http.put(`${environment.apiUrl}/design/${this.itemId}`, this.form.value).subscribe({ next: () => { this.toast.success('Design package updated'); this.router.navigate(['/design', this.itemId]); }, error: (e) => { this.saving = false; this.toast.error(e.error?.errors?.[0]??'Failed to update'); this.cdr.markForCheck(); } }); }
}
