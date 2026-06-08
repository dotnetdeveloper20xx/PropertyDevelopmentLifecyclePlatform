import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { OpportunityStats } from '../../core/models/opportunity.model';
import * as OpportunitiesActions from '../land-acquisition/store/opportunities.actions';
import * as OpportunitiesSelectors from '../land-acquisition/store/opportunities.selectors';

/**
 * Executive Dashboard — the platform command centre.
 * Matches the PNG vision: KPI cards, charts, progress indicators, milestone timeline.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, StatCardComponent, LoadingStateComponent,
    PageHeaderComponent, PageDescriptionComponent,
    BreadcrumbComponent, ChartComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home'}, {label: 'Dashboard'}]"></app-breadcrumb>
    <app-page-header title="Executive Dashboard" subtitle="End-to-End Management of Real Estate Development Projects"></app-page-header>

    @if (statsLoading$ | async) {
      <app-loading-state message="Loading dashboard data..."></app-loading-state>
    } @else if (stats$ | async; as stats) {

      <!-- Top KPI Row (matches PNG centre top) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4 items-center text-center">
            <p class="text-xs text-base-content/50 uppercase">Total Projects</p>
            <p class="text-3xl font-bold text-primary">{{ stats.totalOpportunities }}</p>
          </div>
        </div>
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4 items-center text-center">
            <p class="text-xs text-base-content/50 uppercase">Total Units</p>
            <p class="text-3xl font-bold text-secondary">100</p>
          </div>
        </div>
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4 items-center text-center">
            <p class="text-xs text-base-content/50 uppercase">Project Value</p>
            <p class="text-2xl font-bold text-accent">£{{ (stats.totalPipelineValue || 0) | number:'1.0-0' }}</p>
          </div>
        </div>
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4 items-center text-center">
            <p class="text-xs text-base-content/50 uppercase">Total Budget</p>
            <p class="text-2xl font-bold text-info">£41.8M</p>
          </div>
        </div>
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4 items-center text-center">
            <p class="text-xs text-base-content/50 uppercase">Sales Value</p>
            <p class="text-2xl font-bold text-success">£61.7M</p>
          </div>
        </div>
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4 items-center text-center">
            <p class="text-xs text-base-content/50 uppercase">Projected Profit</p>
            <p class="text-2xl font-bold text-warning">£19.9M</p>
          </div>
        </div>
      </div>

      <!-- Charts Row (matches PNG centre middle) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Project Progress Donut -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4">
            <h3 class="text-xs font-semibold text-base-content/50 uppercase mb-2">Project Progress</h3>
            <app-chart [config]="projectProgressConfig" height="180px"></app-chart>
          </div>
        </div>

        <!-- Budget vs Actual Bar Chart -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4">
            <h3 class="text-xs font-semibold text-base-content/50 uppercase mb-2">Budget vs Actual</h3>
            <app-chart [config]="budgetVsActualConfig" height="180px"></app-chart>
          </div>
        </div>

        <!-- Construction Progress Donut -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4">
            <h3 class="text-xs font-semibold text-base-content/50 uppercase mb-2">Construction Progress</h3>
            <app-chart [config]="constructionProgressConfig" height="180px"></app-chart>
            <p class="text-center text-lg font-bold text-primary mt-1">62%</p>
            <p class="text-center text-xs text-base-content/50">Average Progress</p>
          </div>
        </div>

        <!-- Sales Progress Pie -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4">
            <h3 class="text-xs font-semibold text-base-content/50 uppercase mb-2">Sales Progress (Units)</h3>
            <app-chart [config]="salesProgressConfig" height="180px"></app-chart>
          </div>
        </div>
      </div>

      <!-- Upcoming Milestones (matches PNG right section) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div class="lg:col-span-2">
          <!-- Pipeline by Status -->
          <div class="card bg-base-100 border border-base-300 shadow-sm">
            <div class="card-body p-4">
              <h3 class="text-xs font-semibold text-base-content/50 uppercase mb-3">
                <a routerLink="/opportunities" class="hover:text-primary">Land Acquisition Pipeline →</a>
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                <app-stat-card label="Identified" [value]="stats.identified"></app-stat-card>
                <app-stat-card label="Review" [value]="stats.initialReview"></app-stat-card>
                <app-stat-card label="Due Diligence" [value]="stats.dueDiligence"></app-stat-card>
                <app-stat-card label="Offer" [value]="stats.offerMade"></app-stat-card>
                <app-stat-card label="Contract" [value]="stats.underContract"></app-stat-card>
                <app-stat-card label="Acquired" [value]="stats.acquired"></app-stat-card>
                <app-stat-card label="Withdrawn" [value]="stats.withdrawn"></app-stat-card>
              </div>
            </div>
          </div>
        </div>

        <!-- Milestones -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-4">
            <h3 class="text-xs font-semibold text-base-content/50 uppercase mb-3">Upcoming Milestones</h3>
            <div class="space-y-3">
              @for (milestone of upcomingMilestones; track milestone.date) {
                <div class="flex items-center gap-3 border-l-4 border-primary pl-3 py-1">
                  <div class="text-xs text-base-content/50 whitespace-nowrap">{{ milestone.date }}</div>
                  <div class="text-sm font-medium">{{ milestone.title }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Module Quick Links -->
      <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Quick Actions</h2>
      <div class="flex flex-wrap gap-3">
        <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Opportunity</a>
        <a routerLink="/planning/new" class="btn btn-primary btn-sm">Create Application</a>
        <a routerLink="/projects/new" class="btn btn-primary btn-sm">Create Project</a>
        <a routerLink="/legal/contracts/new" class="btn btn-primary btn-sm">Create Contract</a>
        <a routerLink="/opportunities" class="btn btn-ghost btn-sm">View Pipeline</a>
        <a routerLink="/projects" class="btn btn-ghost btn-sm">View Projects</a>
        <a routerLink="/finance" class="btn btn-ghost btn-sm">Finance</a>
        <a routerLink="/help" class="btn btn-ghost btn-sm">Help Centre</a>
      </div>
    } @else {
      <!-- First visit — no stats yet -->
      <div class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center">
        <div class="text-5xl mb-4">🏗️</div>
        <h3 class="text-xl font-bold">Welcome to BuildEstate Pro</h3>
        <p class="text-base-content/60 mt-3">End-to-end management of real estate development projects — from land to legacy.</p>
        <div class="flex flex-wrap justify-center gap-3 mt-6">
          <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Your First Opportunity</a>
          <a routerLink="/help/getting-started" class="btn btn-ghost btn-sm">Getting Started Guide</a>
        </div>
      </div>
    }
  `
})
export class DashboardComponent implements OnInit {
  stats$: Observable<OpportunityStats | null>;
  statsLoading$: Observable<boolean>;

  // Upcoming milestones (from demo data)
  upcomingMilestones = [
    { date: '15 Jul', title: 'Roofing Complete' },
    { date: '30 Sep', title: 'First Fix Complete' },
    { date: '15 Apr', title: 'Handover Block A' }
  ];

  // Chart configurations matching the PNG
  projectProgressConfig: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{
        data: [2, 1, 2],
        backgroundColor: ['#36d399', '#fbbd23', '#e5e7eb'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }
  };

  budgetVsActualConfig: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: ['Land', 'Construction', 'Fees', 'Marketing', 'Contingency'],
      datasets: [
        { label: 'Budget', data: [4.5, 28, 3.5, 2.8, 3], backgroundColor: '#3b82f6' },
        { label: 'Actual', data: [4.5, 12.5, 1.2, 0.3, 0], backgroundColor: '#f97316' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: (v) => `£${v}M` } } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }
  };

  constructionProgressConfig: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: ['Complete', 'Remaining'],
      datasets: [{
        data: [62, 38],
        backgroundColor: ['#6366f1', '#e5e7eb'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  };

  salesProgressConfig: ChartConfiguration = {
    type: 'pie',
    data: {
      labels: ['Sold', 'Reserved', 'Available', 'Not Released'],
      datasets: [{
        data: [8, 4, 3, 5],
        backgroundColor: ['#36d399', '#fbbd23', '#3b82f6', '#e5e7eb'],
        borderWidth: 1
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }
  };

  constructor(private store: Store) {
    this.stats$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesStats);
    this.statsLoading$ = this.store.select(OpportunitiesSelectors.selectStatsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(OpportunitiesActions.loadStats());
  }
}
