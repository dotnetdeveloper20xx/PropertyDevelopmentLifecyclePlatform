import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { OpportunityStats } from '../../core/models/opportunity.model';
import * as OpportunitiesActions from '../land-acquisition/store/opportunities.actions';
import * as OpportunitiesSelectors from '../land-acquisition/store/opportunities.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, LoadingStateComponent, ErrorStateComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Land Acquisition Dashboard" subtitle="Pipeline overview and key metrics"></app-page-header>

    @if (statsLoading$ | async) {
      <app-loading-state message="Loading dashboard..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadStats()"></app-error-state>
    } @else if (stats$ | async; as stats) {
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <app-stat-card label="Total" [value]="stats.totalOpportunities"></app-stat-card>
        <app-stat-card label="Identified" [value]="stats.identified"></app-stat-card>
        <app-stat-card label="Due Diligence" [value]="stats.dueDiligence"></app-stat-card>
        <app-stat-card label="Offer Made" [value]="stats.offerMade"></app-stat-card>
        <app-stat-card label="Under Contract" [value]="stats.underContract"></app-stat-card>
        <app-stat-card label="Acquired" [value]="stats.acquired"></app-stat-card>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card bg-base-100 shadow-sm border border-base-300">
          <div class="card-body">
            <h2 class="card-title text-sm text-base-content/60">Total Pipeline Value</h2>
            <p class="text-3xl font-bold text-primary">£{{ stats.totalPipelineValue | number:'1.0-0' }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-300">
          <div class="card-body">
            <h2 class="card-title text-sm text-base-content/60">Average Asking Price</h2>
            <p class="text-3xl font-bold text-accent">
              {{ stats.averageAskingPrice ? ('£' + (stats.averageAskingPrice | number:'1.0-0')) : 'N/A' }}
            </p>
          </div>
        </div>
      </div>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center">
        <p class="text-base-content/60">No pipeline data available. Create your first opportunity to see stats.</p>
      </div>
    }
  `
})
export class DashboardComponent implements OnInit {
  stats$: Observable<OpportunityStats | null>;
  statsLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.stats$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesStats);
    this.statsLoading$ = this.store.select(OpportunitiesSelectors.selectStatsLoading);
    this.error$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesError);
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.store.dispatch(OpportunitiesActions.loadStats());
  }
}
