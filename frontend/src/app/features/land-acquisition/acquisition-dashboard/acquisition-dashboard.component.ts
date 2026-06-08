import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { OpportunityStats } from '../../../core/models/opportunity.model';
import * as OpportunitiesActions from '../store/opportunities.actions';
import * as OpportunitiesSelectors from '../store/opportunities.selectors';

@Component({
  selector: 'app-acquisition-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, KpiCardComponent, StatCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Land Acquisition' },
      { label: 'Dashboard' }
    ]"></app-breadcrumb>

    <app-page-header title="Acquisition Dashboard" subtitle="Pipeline overview and key metrics for land acquisition activities">
    </app-page-header>

    <app-page-description
      description="The Acquisition Dashboard provides a real-time view of your land opportunity pipeline. Track how many opportunities are at each stage, monitor pipeline value, and identify bottlenecks in the acquisition process."
      guidance="Stats are loaded automatically from the opportunities pipeline. Use this view to get a high-level understanding of your acquisition performance and identify areas requiring attention."
      helpLink="/help/land-acquisition/la-pipeline"
    ></app-page-description>

    @if (statsLoading$ | async) {
      <app-loading-state message="Loading acquisition statistics..."></app-loading-state>
    } @else if (stats$ | async; as stats) {
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <app-kpi-card
          label="Total Opportunities"
          [value]="stats.totalOpportunities"
          valueColor="primary"
        ></app-kpi-card>
        <app-kpi-card
          label="Pipeline Value"
          [value]="(stats.totalPipelineValue | number:'1.0-0') ?? '0'"
          prefix="£"
          valueColor="success"
        ></app-kpi-card>
        <app-kpi-card
          label="Average Asking Price"
          [value]="stats.averageAskingPrice !== null ? ((stats.averageAskingPrice | number:'1.0-0') ?? '0') : 'N/A'"
          [prefix]="stats.averageAskingPrice !== null ? '£' : ''"
          valueColor="secondary"
        ></app-kpi-card>
        <app-kpi-card
          label="Acquired"
          [value]="stats.acquired"
          valueColor="accent"
          subtitle="Successfully completed"
        ></app-kpi-card>
      </div>

      <!-- Pipeline by Status -->
      <h3 class="text-lg font-semibold mb-3">Pipeline by Status</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        <app-stat-card label="Identified" [value]="stats.identified"></app-stat-card>
        <app-stat-card label="Initial Review" [value]="stats.initialReview"></app-stat-card>
        <app-stat-card label="Due Diligence" [value]="stats.dueDiligence"></app-stat-card>
        <app-stat-card label="Offer Made" [value]="stats.offerMade"></app-stat-card>
        <app-stat-card label="Under Contract" [value]="stats.underContract"></app-stat-card>
        <app-stat-card label="Acquired" [value]="stats.acquired"></app-stat-card>
        <app-stat-card label="Withdrawn" [value]="stats.withdrawn"></app-stat-card>
      </div>

      <!-- Guidance Card -->
      <div class="card bg-base-200 border border-base-300 p-5">
        <h3 class="font-semibold text-sm mb-2">What do these numbers mean?</h3>
        <ul class="list-disc list-inside text-sm text-base-content/70 space-y-1">
          <li><strong>Identified</strong> — New land leads entered into the system, awaiting initial review.</li>
          <li><strong>Initial Review</strong> — Opportunities being evaluated for viability before due diligence.</li>
          <li><strong>Due Diligence</strong> — Active assessments including legal, environmental, and planning checks.</li>
          <li><strong>Offer Made</strong> — Formal offers submitted and awaiting landowner response.</li>
          <li><strong>Under Contract</strong> — Contracts exchanged, awaiting completion and land transfer.</li>
          <li><strong>Acquired</strong> — Successfully purchased and registered land parcels.</li>
          <li><strong>Withdrawn</strong> — Opportunities removed from the pipeline (failed checks, pricing, etc.).</li>
        </ul>
      </div>
    } @else {
      <div class="card bg-base-200 border border-base-300 p-6 text-center">
        <p class="text-base-content/60">No statistics available. Create opportunities in the pipeline to see dashboard metrics.</p>
      </div>
    }
  `
})
export class AcquisitionDashboardComponent implements OnInit {
  stats$: Observable<OpportunityStats | null>;
  statsLoading$: Observable<boolean>;

  constructor(private store: Store) {
    this.stats$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesStats);
    this.statsLoading$ = this.store.select(OpportunitiesSelectors.selectStatsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(OpportunitiesActions.loadStats());
  }
}
