import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { OpportunityStats } from '../../core/models/opportunity.model';
import * as OpportunitiesActions from '../land-acquisition/store/opportunities.actions';
import * as OpportunitiesSelectors from '../land-acquisition/store/opportunities.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, StatCardComponent, LoadingStateComponent,
    ErrorStateComponent, PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home'}, {label: 'Dashboard'}]"></app-breadcrumb>
    <app-page-header title="Land Acquisition Dashboard" subtitle="Pipeline overview and key metrics"></app-page-header>
    <app-page-description
      description="This dashboard shows the current state of your land acquisition pipeline. Track how many opportunities are at each stage, monitor total pipeline value, and identify where attention is needed."
      guidance="Review opportunities stuck in early stages — they may need action to progress."
    ></app-page-description>

    @if (statsLoading$ | async) {
      <app-loading-state message="Loading dashboard..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadStats()"></app-error-state>
    } @else if (stats$ | async; as stats) {
      <!-- Pipeline Status Cards -->
      <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Pipeline by Status</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
        <app-stat-card label="Identified" [value]="stats.identified"></app-stat-card>
        <app-stat-card label="Initial Review" [value]="stats.initialReview"></app-stat-card>
        <app-stat-card label="Due Diligence" [value]="stats.dueDiligence"></app-stat-card>
        <app-stat-card label="Offer Made" [value]="stats.offerMade"></app-stat-card>
        <app-stat-card label="Under Contract" [value]="stats.underContract"></app-stat-card>
        <app-stat-card label="Acquired" [value]="stats.acquired"></app-stat-card>
        <app-stat-card label="Withdrawn" [value]="stats.withdrawn"></app-stat-card>
      </div>

      <!-- Financial Summary -->
      <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Financial Summary</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="card bg-base-100 shadow-sm border border-base-300">
          <div class="card-body p-5">
            <h3 class="text-xs text-base-content/50 uppercase">Total Pipeline Value</h3>
            <p class="text-2xl font-bold text-primary mt-1">£{{ stats.totalPipelineValue | number:'1.0-0' }}</p>
            <p class="text-xs text-base-content/40 mt-1">Combined asking price of all active opportunities</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-300">
          <div class="card-body p-5">
            <h3 class="text-xs text-base-content/50 uppercase">Average Asking Price</h3>
            <p class="text-2xl font-bold text-accent mt-1">
              {{ stats.averageAskingPrice ? ('£' + (stats.averageAskingPrice | number:'1.0-0')) : 'N/A' }}
            </p>
            <p class="text-xs text-base-content/40 mt-1">Mean value across all priced opportunities</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-300">
          <div class="card-body p-5">
            <h3 class="text-xs text-base-content/50 uppercase">Total Opportunities</h3>
            <p class="text-2xl font-bold text-secondary mt-1">{{ stats.totalOpportunities }}</p>
            <p class="text-xs text-base-content/40 mt-1">All opportunities in the pipeline (excl. withdrawn)</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Quick Actions</h2>
      <div class="flex gap-3">
        <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Land Opportunity</a>
        <a routerLink="/opportunities" class="btn btn-ghost btn-sm">View All Opportunities</a>
      </div>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center">
        <div class="text-4xl mb-4">🏗️</div>
        <h3 class="text-lg font-semibold">Welcome to BuildEstate Pro</h3>
        <p class="text-base-content/60 mt-2 max-w-md mx-auto">
          Your land acquisition pipeline is empty. Start by creating your first opportunity to evaluate a potential development site.
        </p>
        <a routerLink="/opportunities/new" class="btn btn-primary btn-sm mt-4">Create Your First Opportunity</a>
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
