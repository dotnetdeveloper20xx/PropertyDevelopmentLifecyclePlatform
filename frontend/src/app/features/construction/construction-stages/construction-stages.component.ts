import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConstructionStageItem } from '../../../core/models/construction.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as ConstructionActions from '../store/construction.actions';
import * as ConstructionSelectors from '../store/construction.selectors';

@Component({
  selector: 'app-construction-stages',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Design & Construction' },
      { label: 'Stages' }
    ]"></app-breadcrumb>

    <app-page-header title="Construction Stages" subtitle="Track construction progress across all project stages, inspections, and snagging">
    </app-page-header>

    <app-page-description
      description="Construction stages represent the major phases of building work for a project. Each stage tracks its planned and actual dates, progress percentage, inspections carried out, and any snags identified during construction."
      guidance="Enter a project ID below to load the construction stages for that project. You can then view stage progress, schedule inspections, and log snags."
      helpLink="/help/construction/stages-overview"
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
            placeholder="Enter project ID to load stages..."
            [(ngModel)]="projectId"
            (keydown.enter)="loadStages()"
          />
        </div>
        <button class="btn btn-primary btn-sm" [disabled]="!projectId" (click)="loadStages()">
          Load Stages
        </button>
      </div>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading construction stages..."></app-loading-state>
    } @else if (stagesLoaded && (stages$ | async)?.length === 0) {
      <app-empty-state
        title="No Construction Stages"
        message="No construction stages have been created for this project yet. Add your first stage below to begin tracking construction progress.">
      </app-empty-state>
    } @else if ((stages$ | async)?.length) {
      <!-- Stages Table -->
      <div class="card bg-base-100 shadow-sm border border-base-300 mb-4">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Construction stages">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Planned Start</th>
                <th>Planned End</th>
                <th>Inspections</th>
                <th>Snags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (stage of stages$ | async; track stage.id) {
                <tr class="hover">
                  <td class="font-medium">{{ stage.name }}</td>
                  <td><app-status-badge [status]="stage.status"></app-status-badge></td>
                  <td>
                    @if (stage.progressPercent !== null) {
                      <div class="flex items-center gap-2">
                        <progress class="progress progress-primary w-16" [value]="stage.progressPercent" max="100"></progress>
                        <span class="text-xs">{{ stage.progressPercent }}%</span>
                      </div>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td class="text-sm">{{ stage.plannedStartDate ? (stage.plannedStartDate | date:'mediumDate') : '—' }}</td>
                  <td class="text-sm">{{ stage.plannedEndDate ? (stage.plannedEndDate | date:'mediumDate') : '—' }}</td>
                  <td>
                    @if (stage.inspectionCount > 0) {
                      <span class="badge badge-sm badge-outline">{{ stage.inspectionCount }}</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td>
                    @if (stage.snagCount > 0) {
                      <span class="badge badge-sm badge-warning badge-outline">{{ stage.snagCount }}</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td>
                    <a [routerLink]="['/construction', stage.id]" class="btn btn-ghost btn-xs">View</a>
                    <a [routerLink]="['/construction', stage.id, 'edit']" class="btn btn-ghost btn-xs">Edit</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- Add Stage Form -->
    @if (projectId && stagesLoaded) {
      <div class="card bg-base-100 border border-base-300 p-4">
        <h3 class="font-semibold text-sm mb-3">Add Construction Stage</h3>
        <form [formGroup]="stageForm" (ngSubmit)="onCreateStage()" class="flex flex-wrap items-end gap-3">
          <div class="form-control flex-1 min-w-[180px]">
            <label class="label" for="stageName"><span class="label-text">Name *</span></label>
            <input id="stageName" type="text" class="input input-bordered input-sm w-full"
              formControlName="name" placeholder="e.g. Foundation Works" />
          </div>
          <div class="form-control flex-1 min-w-[180px]">
            <label class="label" for="stageDescription"><span class="label-text">Description</span></label>
            <input id="stageDescription" type="text" class="input input-bordered input-sm w-full"
              formControlName="description" placeholder="Brief description" />
          </div>
          <div class="form-control">
            <label class="label" for="stagePlannedStart"><span class="label-text">Planned Start</span></label>
            <input id="stagePlannedStart" type="date" class="input input-bordered input-sm"
              formControlName="plannedStartDate" />
          </div>
          <div class="form-control">
            <label class="label" for="stagePlannedEnd"><span class="label-text">Planned End</span></label>
            <input id="stagePlannedEnd" type="date" class="input input-bordered input-sm"
              formControlName="plannedEndDate" />
          </div>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="stageForm.invalid">
            + Add Stage
          </button>
        </form>
        @if (stageForm.controls['name'].touched && stageForm.controls['name'].hasError('required')) {
          <p class="text-error text-xs mt-1">Please enter a stage name.</p>
        }
      </div>
    }
  `
})
export class ConstructionStagesComponent implements OnInit {
  stages$: Observable<ConstructionStageItem[]>;
  loading$: Observable<boolean>;

  projectId = '';
  stagesLoaded = false;
  stageForm: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.stages$ = this.store.select(ConstructionSelectors.selectStages);
    this.loading$ = this.store.select(ConstructionSelectors.selectStagesLoading);

    this.stageForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      plannedStartDate: [''],
      plannedEndDate: ['']
    });
  }

  ngOnInit(): void {
    const queryProjectId = this.route.snapshot.queryParamMap.get('projectId');
    if (queryProjectId) {
      this.projectId = queryProjectId;
      this.loadStages();
    }
  }

  loadStages(): void {
    if (!this.projectId) return;
    this.stagesLoaded = true;
    this.store.dispatch(ConstructionActions.loadStages({ projectId: this.projectId }));
  }

  exportCsv(): void {
    this.stages$.subscribe(stages => {
      const headers = ['Name', 'Status', 'Progress %', 'Planned Start', 'Planned End', 'Inspections', 'Snags'];
      const rows = stages.map(s => [
        s.name,
        s.status,
        s.progressPercent?.toString() ?? '',
        s.plannedStartDate ?? '',
        s.plannedEndDate ?? '',
        s.inspectionCount.toString(),
        s.snagCount.toString()
      ]);
      exportToCsv('construction-stages', headers, rows);
    }).unsubscribe();
  }

  onCreateStage(): void {
    if (this.stageForm.invalid || !this.projectId) return;
    const raw = this.stageForm.getRawValue();
    this.store.dispatch(ConstructionActions.createStage({
      projectId: this.projectId,
      request: {
        name: raw.name,
        description: raw.description || undefined,
        plannedStartDate: raw.plannedStartDate || undefined,
        plannedEndDate: raw.plannedEndDate || undefined
      }
    }));
    this.stageForm.reset();
  }
}
