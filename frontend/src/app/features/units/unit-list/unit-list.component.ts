import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { ActivityFeedComponent } from '../../../shared/components/activity-feed/activity-feed.component';
import { UnitItem, UnitType, CreateUnitRequest } from '../../../core/models/unit.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as UnitsActions from '../store/units.actions';
import * as UnitsSelectors from '../store/units.selectors';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent,
    ActivityFeedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Property Units'}, {label: 'Unit Register'}]"></app-breadcrumb>
    <app-page-header title="Property Units" subtitle="Configure and manage units across your development projects">
      <button class="btn btn-primary btn-sm" (click)="toggleForm()">+ Add Unit</button>
    </app-page-header>
    <app-page-description
      description="Property Units represent the individual sellable or rentable assets within a development project — apartments, houses, penthouses, commercial spaces, and parking. Track their configuration, pricing, and availability status."
      guidance="Enter a Project ID below to load units for a specific project. Use the inline form to register new units with their details."
      helpLink="/help/units/units-overview"
    ></app-page-description>

    <!-- Project Selector -->
    <div class="flex items-center gap-3 mb-4">
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">Project ID</span></div>
        <div class="flex gap-2">
          <input type="text" class="input input-bordered input-sm flex-1"
            placeholder="Enter project ID to load units"
            [(ngModel)]="projectId" (keyup.enter)="loadUnits()" aria-label="Project ID" />
          <button class="btn btn-sm btn-outline" [disabled]="!projectId" (click)="loadUnits()">Load</button>
        </div>
      </label>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    <!-- Inline Add Form -->
    @if (showForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">Register New Unit</h3>
        <form [formGroup]="unitForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Reference *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="reference"
              placeholder="e.g. A-101, B-202" />
            @if (unitForm.get('reference')?.touched && unitForm.get('reference')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Reference is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Type *</span></label>
            <select class="select select-bordered select-sm" formControlName="type">
              <option value="">Select type...</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
              <option value="Duplex">Duplex</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Commercial">Commercial</option>
              <option value="Parking">Parking</option>
            </select>
            @if (unitForm.get('type')?.touched && unitForm.get('type')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Type is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Bedrooms *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="bedrooms"
              placeholder="e.g. 2" min="0" />
            @if (unitForm.get('bedrooms')?.touched && unitForm.get('bedrooms')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Bedrooms is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Price *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="price"
              placeholder="e.g. 350000" min="0" step="0.01" />
            @if (unitForm.get('price')?.touched && unitForm.get('price')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Price is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Floor</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="floor"
              placeholder="e.g. 3" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Bathrooms</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="bathrooms"
              placeholder="e.g. 1" min="0" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Area (sq ft)</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="areaSqFt"
              placeholder="e.g. 850" min="0" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="unitForm.invalid || !projectId">Register Unit</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading units..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadUnits()"></app-error-state>
    } @else if (!projectId) {
      <app-empty-state
        title="Select a Project"
        message="Enter a project ID above and click Load to view property units for that project.">
      </app-empty-state>
    } @else if ((units$ | async)?.length === 0) {
      <app-empty-state
        title="No Units Registered"
        message="Create your first property unit to begin building your unit schedule. Units represent individual sellable or rentable assets within your development project.">
        <button class="btn btn-primary btn-sm" (click)="toggleForm()">Register Your First Unit</button>
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Property units">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Beds</th>
                <th>Baths</th>
                <th>Area (sq ft)</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (unit of units$ | async; track unit.id) {
                <tr class="hover">
                  <td class="font-medium font-mono text-sm">{{ unit.reference }}</td>
                  <td><span class="badge badge-sm badge-outline">{{ unit.type }}</span></td>
                  <td class="text-sm">{{ unit.floor ?? '—' }}</td>
                  <td class="text-sm">{{ unit.bedrooms }}</td>
                  <td class="text-sm">{{ unit.bathrooms }}</td>
                  <td class="text-sm font-mono">{{ unit.areaSqFt ? (unit.areaSqFt | number:'1.0-0') : '—' }}</td>
                  <td class="font-mono text-sm">{{ unit.currency }} {{ unit.price | number:'1.2-2' }}</td>
                  <td><app-status-badge [status]="unit.status"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- Activity Feed -->
    <div class="mt-6">
      <app-activity-feed module="PropertyUnit" title="Recent Activity" [limit]="5"></app-activity-feed>
    </div>
  `
})
export class UnitListComponent implements OnInit {
  units$: Observable<UnitItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  projectId = '';
  showForm = false;

  unitForm = new FormGroup({
    reference: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<UnitType | ''>('', { nonNullable: true, validators: [Validators.required] }),
    bedrooms: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    floor: new FormControl<number | null>(null),
    bathrooms: new FormControl<number | null>(null),
    areaSqFt: new FormControl<number | null>(null),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.units$ = this.store.select(UnitsSelectors.selectUnits);
    this.loading$ = this.store.select(UnitsSelectors.selectUnitsLoading);
    this.error$ = this.store.select(UnitsSelectors.selectUnitsError);
  }

  ngOnInit(): void {}

  loadUnits(): void {
    if (!this.projectId) return;
    this.store.dispatch(UnitsActions.loadUnits({ projectId: this.projectId }));
  }

  exportCsv(): void {
    this.units$.subscribe(units => {
      const headers = ['Reference', 'Type', 'Floor', 'Bedrooms', 'Bathrooms', 'Area (sq ft)', 'Currency', 'Price', 'Status'];
      const rows = units.map(u => [
        u.reference,
        u.type,
        u.floor?.toString() ?? '',
        u.bedrooms.toString(),
        u.bathrooms?.toString() ?? '',
        u.areaSqFt?.toString() ?? '',
        u.currency,
        u.price.toString(),
        u.status
      ]);
      exportToCsv('property-units', headers, rows);
    }).unsubscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.unitForm.reset();
    }
  }

  onSubmit(): void {
    if (this.unitForm.invalid || !this.projectId) return;

    const formValue = this.unitForm.getRawValue();
    const request: CreateUnitRequest = {
      reference: formValue.reference,
      type: formValue.type as UnitType,
      bedrooms: formValue.bedrooms ?? 0,
      price: formValue.price ?? 0,
      floor: formValue.floor ?? undefined,
      bathrooms: formValue.bathrooms ?? undefined,
      areaSqFt: formValue.areaSqFt ?? undefined,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(UnitsActions.createUnit({ projectId: this.projectId, request }));
    this.unitForm.reset();
    this.showForm = false;
  }
}
