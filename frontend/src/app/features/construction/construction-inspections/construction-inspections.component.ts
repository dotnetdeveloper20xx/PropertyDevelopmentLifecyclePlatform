import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { InspectionItem } from '../../../core/models/construction.model';
import * as ConstructionActions from '../store/construction.actions';
import * as ConstructionSelectors from '../store/construction.selectors';

@Component({
  selector: 'app-construction-inspections',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Design & Construction' },
      { label: 'Inspections' }
    ]"></app-breadcrumb>

    <app-page-header title="Inspections" subtitle="Track and manage construction inspections across all stages">
    </app-page-header>

    <app-page-description
      description="Inspections are scheduled within construction stages to verify build quality and compliance. They cover foundation checks, structural integrity, electrical and plumbing work, fire safety, roofing, finishing, external areas, snagging, and final handover sign-off."
      guidance="Enter a construction stage ID below to load inspections for that stage. Inspections are typically created by Site Managers and carried out by qualified inspectors."
      helpLink="/help/construction/inspections-overview"
    ></app-page-description>

    <!-- Stage ID Input -->
    <div class="card bg-base-100 border border-base-300 p-4 mb-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="form-control flex-1 min-w-[250px]">
          <label class="label" for="stageIdInput">
            <span class="label-text font-medium">Construction Stage ID</span>
          </label>
          <input
            id="stageIdInput"
            type="text"
            class="input input-bordered input-sm w-full"
            placeholder="Enter construction stage ID to load inspections..."
            [(ngModel)]="stageId"
            (keydown.enter)="loadInspections()"
            aria-label="Construction Stage ID"
          />
        </div>
        <button class="btn btn-primary btn-sm" [disabled]="!stageId" (click)="loadInspections()">
          Load Inspections
        </button>
      </div>
    </div>

    @if (loading$ | async) {
      <app-loading-state message="Loading inspections..."></app-loading-state>
    } @else if (!inspectionsLoaded) {
      <app-empty-state
        title="Select a Construction Stage"
        message="Enter a construction stage ID above and click Load to view inspections for that stage. You can find stage IDs on the Construction Stages page.">
      </app-empty-state>
    } @else if ((inspections$ | async)?.length === 0) {
      <app-empty-state
        title="No Inspections Scheduled"
        message="No inspections have been created for this construction stage yet. Inspections can be scheduled from the construction stage detail view.">
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Construction inspections">
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Inspector</th>
                <th>Scheduled Date</th>
                <th>Completed</th>
                <th>Defects Found</th>
              </tr>
            </thead>
            <tbody>
              @for (inspection of inspections$ | async; track inspection.id) {
                <tr class="hover">
                  <td class="font-medium">{{ formatType(inspection.type) }}</td>
                  <td><app-status-badge [status]="inspection.status"></app-status-badge></td>
                  <td>{{ inspection.inspector || '—' }}</td>
                  <td class="text-sm">{{ inspection.scheduledDate | date:'mediumDate' }}</td>
                  <td class="text-sm">{{ inspection.completedDate ? (inspection.completedDate | date:'mediumDate') : '—' }}</td>
                  <td>
                    @if (inspection.defectsFound > 0) {
                      <span class="badge badge-sm badge-warning badge-outline">{{ inspection.defectsFound }}</span>
                    } @else if (inspection.completedDate) {
                      <span class="badge badge-sm badge-success badge-outline">0</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class ConstructionInspectionsComponent {
  inspections$: Observable<InspectionItem[]>;
  loading$: Observable<boolean>;

  stageId = '';
  inspectionsLoaded = false;

  constructor(private store: Store) {
    this.inspections$ = this.store.select(ConstructionSelectors.selectInspections);
    this.loading$ = this.store.select(ConstructionSelectors.selectInspectionsLoading);
  }

  loadInspections(): void {
    if (!this.stageId) return;
    this.inspectionsLoaded = true;
    this.store.dispatch(ConstructionActions.loadInspections({ stageId: this.stageId }));
  }

  formatType(type: string): string {
    switch (type) {
      case 'FireSafety': return 'Fire Safety';
      case 'FinalHandover': return 'Final Handover';
      default: return type;
    }
  }
}
