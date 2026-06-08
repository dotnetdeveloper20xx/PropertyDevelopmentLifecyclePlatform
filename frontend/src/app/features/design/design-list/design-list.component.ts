import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { DesignPackageItem, CreateDesignPackageRequest } from '../../../core/models/design.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as DesignActions from '../store/design.actions';
import * as DesignSelectors from '../store/design.selectors';

@Component({
  selector: 'app-design-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Design & Professional Services'}, {label: 'Packages'}]"></app-breadcrumb>
    <app-page-header title="Design Packages" subtitle="Manage architectural designs, engineering drawings, and consultant deliverables">
    </app-page-header>
    <app-page-description
      description="Design packages represent groups of professional deliverables for a project — architectural drawings, structural engineering, MEP designs, landscape plans, and other consultant outputs. Each package goes through a review and approval workflow before construction can begin."
      guidance="Enter a Project ID below to load design packages for that project. Create new packages to track consultant deliverables through the approval process."
      helpLink="/help/design/design-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    <!-- Project ID Input -->
    <div class="card bg-base-100 border border-base-300 p-4 mb-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="form-control flex-1 min-w-[250px]">
          <label class="label" for="projectIdInput">
            <span class="label-text font-medium">Project ID</span>
          </label>
          <input
            id="projectIdInput"
            type="text"
            class="input input-bordered input-sm w-full"
            placeholder="Enter project ID to load design packages..."
            [(ngModel)]="projectId"
            (keydown.enter)="loadPackages()"
          />
        </div>
        <button class="btn btn-primary btn-sm" [disabled]="!projectId" (click)="loadPackages()">
          Load Packages
        </button>
      </div>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading design packages..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadPackages()"></app-error-state>
    } @else if (!projectId || !packagesLoaded) {
      <app-empty-state
        title="Select a Project"
        message="Enter a project ID above and click Load to view design packages for that project.">
      </app-empty-state>
    } @else if (packagesLoaded && (packages$ | async)?.length === 0) {
      <app-empty-state
        title="No Design Packages"
        message="No design packages have been created for this project yet. Add your first package below to begin tracking architectural and engineering deliverables.">
      </app-empty-state>
    } @else if ((packages$ | async)?.length) {
      <div class="card bg-base-100 shadow-sm border border-base-300 mb-4">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Design packages">
            <thead>
              <tr>
                <th>Name</th>
                <th>Discipline</th>
                <th>Consultant</th>
                <th>Status</th>
                <th>Version</th>
                <th>Submitted</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              @for (pkg of packages$ | async; track pkg.id) {
                <tr class="hover">
                  <td class="font-medium">{{ pkg.name }}</td>
                  <td class="text-sm">{{ pkg.discipline ?? '—' }}</td>
                  <td class="text-sm">{{ pkg.consultant ?? '—' }}</td>
                  <td><app-status-badge [status]="pkg.status"></app-status-badge></td>
                  <td><span class="badge badge-sm badge-outline">v{{ pkg.version }}</span></td>
                  <td class="text-xs text-base-content/50">{{ pkg.submittedDate ? (pkg.submittedDate | date:'mediumDate') : '—' }}</td>
                  <td class="text-xs text-base-content/50">{{ pkg.approvedDate ? (pkg.approvedDate | date:'mediumDate') : '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- Add Design Package Form -->
    @if (projectId && packagesLoaded) {
      <div class="card bg-base-100 border border-base-300 p-4">
        <h3 class="font-semibold text-sm mb-3">Add Design Package</h3>
        <form [formGroup]="packageForm" (ngSubmit)="onCreatePackage()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Name *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="name"
              placeholder="e.g. Architectural Stage 3" />
            @if (packageForm.get('name')?.touched && packageForm.get('name')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Package name is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Discipline</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="discipline"
              placeholder="e.g. Architecture, Structural, MEP" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Consultant</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="consultant"
              placeholder="e.g. Smith & Partners Architects" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="packageForm.invalid">Create Package</button>
          </div>
        </form>
      </div>
    }
  `
})
export class DesignListComponent implements OnInit {
  packages$: Observable<DesignPackageItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  projectId = '';
  packagesLoaded = false;

  packageForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    discipline: new FormControl('', { nonNullable: true }),
    consultant: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.packages$ = this.store.select(DesignSelectors.selectDesignPackages);
    this.loading$ = this.store.select(DesignSelectors.selectDesignLoading);
    this.error$ = this.store.select(DesignSelectors.selectDesignError);
  }

  ngOnInit(): void {
    const queryProjectId = this.route.snapshot.queryParamMap.get('projectId');
    if (queryProjectId) {
      this.projectId = queryProjectId;
      this.loadPackages();
    }
  }

  loadPackages(): void {
    if (!this.projectId) return;
    this.packagesLoaded = true;
    this.store.dispatch(DesignActions.loadDesignPackages({ projectId: this.projectId }));
  }

  exportCsv(): void {
    this.packages$.subscribe(packages => {
      const headers = ['Name', 'Discipline', 'Consultant', 'Status', 'Version', 'Submitted', 'Approved'];
      const rows = packages.map(p => [
        p.name,
        p.discipline ?? '',
        p.consultant ?? '',
        p.status,
        p.version.toString(),
        p.submittedDate ?? '',
        p.approvedDate ?? ''
      ]);
      exportToCsv('design-packages', headers, rows);
    }).unsubscribe();
  }

  onCreatePackage(): void {
    if (this.packageForm.invalid || !this.projectId) return;

    const formValue = this.packageForm.getRawValue();
    const request: CreateDesignPackageRequest = {
      name: formValue.name,
      description: formValue.description || undefined,
      discipline: formValue.discipline || undefined,
      consultant: formValue.consultant || undefined,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(DesignActions.createDesignPackage({
      projectId: this.projectId,
      request
    }));
    this.packageForm.reset();
  }
}
