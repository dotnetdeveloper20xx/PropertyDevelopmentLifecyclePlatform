import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { OpportunityListItem } from '../../../../core/models/opportunity.model';
import * as OpportunitiesActions from '../../store/opportunities.actions';
import * as OpportunitiesSelectors from '../../store/opportunities.selectors';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, PageHeaderComponent, PageDescriptionComponent,
    BreadcrumbComponent, LoadingStateComponent, EmptyStateComponent,
    StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Land Acquisition'}, {label: 'Opportunities'}]"></app-breadcrumb>
    <app-page-header title="Land Opportunities" subtitle="Manage your acquisition pipeline">
      <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Land Opportunity</a>
    </app-page-header>
    <app-page-description
      description="Land opportunities represent potential sites for development. Each opportunity progresses through a lifecycle: Identified → Initial Review → Due Diligence → Offer → Contract → Acquired."
      guidance="Click any row to view full details, add due diligence checks, or make offers."
    ></app-page-description>

    @if (loading$ | async) {
      <app-loading-state message="Loading opportunities..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadOpportunities()"></app-error-state>
    } @else if ((opportunities$ | async)?.length === 0) {
      <app-empty-state
        title="No Land Opportunities Yet"
        message="Land opportunities are potential development sites you're evaluating for purchase. Create your first opportunity to start tracking a potential land acquisition through due diligence, offer, and completion.">
        <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Your First Opportunity</a>
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Land opportunities pipeline">
            <thead>
              <tr>
                <th>Opportunity Name</th>
                <th>Location</th>
                <th>Land Size</th>
                <th>Asking Price</th>
                <th>Pipeline Stage</th>
              </tr>
            </thead>
            <tbody>
              @for (opp of opportunities$ | async; track opp.id) {
                <tr class="hover cursor-pointer" [routerLink]="['/opportunities', opp.id]" role="link" tabindex="0" (keydown.enter)="null">
                  <td class="font-medium">{{ opp.name }}</td>
                  <td>{{ opp.location }}</td>
                  <td>{{ opp.landSize }} {{ opp.landSizeUnit }}</td>
                  <td>{{ opp.askingPrice ? ('£' + (opp.askingPrice | number:'1.0-0')) : 'Not priced' }}</td>
                  <td><app-status-badge [status]="opp.status"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <p class="text-center text-sm text-base-content/50 mt-4">
        Showing {{ (opportunities$ | async)?.length }} of {{ totalCount$ | async }} opportunities
      </p>
    }
  `
})
export class OpportunityListComponent implements OnInit {
  opportunities$: Observable<OpportunityListItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  constructor(private store: Store) {
    this.opportunities$ = this.store.select(OpportunitiesSelectors.selectAllOpportunities);
    this.loading$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesLoading);
    this.error$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesError);
    this.totalCount$ = this.store.select(OpportunitiesSelectors.selectOpportunitiesTotalCount);
  }

  ngOnInit(): void {
    this.loadOpportunities();
  }

  loadOpportunities(): void {
    this.store.dispatch(OpportunitiesActions.loadOpportunities({ page: 1, pageSize: 50 }));
  }
}
