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

/**
 * Main dashboard with pipeline stats, financial summary, attention items, and quick actions.
 * Answers: What happened? What is happening? What needs attention? What should I do next?
 */
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
    <app-page-header title="Land Acquisition Dashboard" subtitle="Pipeline overview and key metrics">
      <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">+ New Opportunity</a>
    </app-page-header>
    <app-page-description
      description="This dashboard shows the current state of your land acquisition pipeline. Track how many opportunities are at each stage, monitor total pipeline value, and identify where attention is needed."
      guidance="Review the 'Attention Needed' section for items that require action."
      helpLink="/help/modules/mod-dashboard"
    ></app-page-description>

    @if (statsLoading$ | async) {
      <app-loading-state message="Loading dashboard..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadStats()"></app-error-state>
    } @else if (stats$ | async; as stats) {

      <!-- Attention Needed Section -->
      @if (getAttentionItems(stats).length > 0) {
        <div class="mb-8">
          <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
            Attention Needed
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            @for (item of getAttentionItems(stats); track item.label) {
              <div class="card bg-warning/5 border border-warning/30">
                <div class="card-body p-4 flex-row items-center gap-3">
                  <div class="text-warning text-xl">{{ item.icon }}</div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-base-content">{{ item.label }}</p>
                    <p class="text-xs text-base-content/60">{{ item.description }}</p>
                  </div>
                  @if (item.action) {
                    <a [routerLink]="item.action" class="btn btn-ghost btn-xs">View →</a>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

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
      <div class="flex flex-wrap gap-3">
        <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Land Opportunity</a>
        <a routerLink="/opportunities" class="btn btn-ghost btn-sm">View All Opportunities</a>
        <a routerLink="/help/getting-started" class="btn btn-ghost btn-sm">Getting Started Guide</a>
      </div>
    } @else {
      <!-- First-Time User Welcome -->
      <div class="card bg-base-100 shadow-sm border border-base-300 p-8">
        <div class="max-w-lg mx-auto text-center">
          <div class="text-5xl mb-4">🏗️</div>
          <h3 class="text-xl font-bold">Welcome to BuildEstate Pro</h3>
          <p class="text-base-content/60 mt-3 leading-relaxed">
            Your land acquisition pipeline is empty. Start by creating your first opportunity to evaluate a potential development site.
          </p>

          <div class="divider my-6">Get Started</div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <a routerLink="/opportunities/new" class="card bg-primary/5 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer p-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">📍</span>
                <div>
                  <p class="font-medium text-sm">Create Opportunity</p>
                  <p class="text-xs text-base-content/50">Add a land site to evaluate</p>
                </div>
              </div>
            </a>
            <a routerLink="/help/getting-started/gs-welcome" class="card bg-info/5 border border-info/20 hover:border-info/50 transition-colors cursor-pointer p-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">📖</span>
                <div>
                  <p class="font-medium text-sm">Read the Guide</p>
                  <p class="text-xs text-base-content/50">Learn how the platform works</p>
                </div>
              </div>
            </a>
            <a routerLink="/help/land-acquisition/la-pipeline" class="card bg-accent/5 border border-accent/20 hover:border-accent/50 transition-colors cursor-pointer p-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🔄</span>
                <div>
                  <p class="font-medium text-sm">Understand the Pipeline</p>
                  <p class="text-xs text-base-content/50">How opportunities progress</p>
                </div>
              </div>
            </a>
            <a routerLink="/help" class="card bg-secondary/5 border border-secondary/20 hover:border-secondary/50 transition-colors cursor-pointer p-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">❓</span>
                <div>
                  <p class="font-medium text-sm">Help Centre</p>
                  <p class="text-xs text-base-content/50">FAQs, glossary, and more</p>
                </div>
              </div>
            </a>
          </div>
        </div>
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

  /**
   * Derive attention items from stats. Highlights situations needing user action.
   */
  getAttentionItems(stats: OpportunityStats): AttentionItem[] {
    const items: AttentionItem[] = [];

    if (stats.identified > 5) {
      items.push({
        icon: '⚠️',
        label: `${stats.identified} opportunities stuck in "Identified"`,
        description: 'These may need initial review to progress.',
        action: '/opportunities'
      });
    }

    if (stats.dueDiligence > 3) {
      items.push({
        icon: '🔍',
        label: `${stats.dueDiligence} opportunities in due diligence`,
        description: 'Check if any due diligence reports are overdue.',
        action: '/opportunities'
      });
    }

    if (stats.offerMade > 2) {
      items.push({
        icon: '💰',
        label: `${stats.offerMade} offers awaiting response`,
        description: 'Follow up with sellers or agents on outstanding offers.',
        action: '/opportunities'
      });
    }

    if (stats.totalOpportunities === 0) {
      items.push({
        icon: '📭',
        label: 'Your pipeline is empty',
        description: 'Create your first opportunity to start tracking land acquisitions.',
        action: '/opportunities/new'
      });
    }

    return items;
  }
}

interface AttentionItem {
  icon: string;
  label: string;
  description: string;
  action?: string;
}
