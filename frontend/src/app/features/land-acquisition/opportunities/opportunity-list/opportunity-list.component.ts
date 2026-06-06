import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { OpportunityListItem } from '../../../../core/models/opportunity.model';
import * as OpportunitiesActions from '../../store/opportunities.actions';
import * as OpportunitiesSelectors from '../../store/opportunities.selectors';

/**
 * Opportunity list container component. Dispatches load action to NgRx store.
 * Renders via shared components (page-header, status-badge, loading, empty, error states).
 */
@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, PageHeaderComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Land Opportunities" subtitle="Manage your acquisition pipeline">
      <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">+ New Opportunity</a>
    </app-page-header>

    @if (loading$ | async) {
      <app-loading-state message="Loading opportunities..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadOpportunities()"></app-error-state>
    } @else if ((opportunities$ | async)?.length === 0) {
      <app-empty-state title="No opportunities yet" message="Create your first land opportunity to get started.">
        <a routerLink="/opportunities/new" class="btn btn-primary btn-sm">Create Opportunity</a>
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Land opportunities">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Size</th>
                <th>Asking Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (opp of opportunities$ | async; track opp.id) {
                <tr class="hover cursor-pointer" [routerLink]="['/opportunities', opp.id]">
                  <td class="font-medium">{{ opp.name }}</td>
                  <td>{{ opp.location }}</td>
                  <td>{{ opp.landSize }} {{ opp.landSizeUnit }}</td>
                  <td>{{ opp.askingPrice ? ('£' + (opp.askingPrice | number:'1.0-0')) : '—' }}</td>
                  <td><app-status-badge [status]="opp.status"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="text-center text-sm text-base-content/60 mt-4">
        {{ (opportunities$ | async)?.length }} of {{ totalCount$ | async }} opportunities
      </div>
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
