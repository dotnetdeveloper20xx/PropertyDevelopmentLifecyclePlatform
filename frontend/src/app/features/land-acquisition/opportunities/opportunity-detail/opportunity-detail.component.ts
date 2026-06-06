import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { OpportunityService } from '../../../../core/services/opportunity.service';
import { OpportunityDetail } from '../../../../core/models/opportunity.model';

/**
 * Opportunity detail page. Loads single opportunity via service (not store — detail is transient).
 * Uses tabbed layout for Details, Due Diligence, Offers, Documents sections.
 */
@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingStateComponent, StatusBadgeComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading opportunity..."></app-loading-state>
    } @else if (opportunity) {
      <app-page-header [title]="opportunity.name" [subtitle]="opportunity.location">
        <app-status-badge [status]="opportunity.status"></app-status-badge>
      </app-page-header>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered mb-6">
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'details'" (click)="activeTab = 'details'">Details</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'dd'" (click)="activeTab = 'dd'">Due Diligence ({{ opportunity.dueDiligenceCount }})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'offers'" (click)="activeTab = 'offers'">Offers ({{ opportunity.offerCount }})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'docs'" (click)="activeTab = 'docs'">Documents ({{ opportunity.documentCount }})</button>
      </div>

      @if (activeTab === 'details') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Land Info Card -->
          <div class="card bg-base-100 shadow-sm border border-base-300">
            <div class="card-body">
              <h3 class="card-title text-sm">Land Information</h3>
              <dl class="space-y-2 mt-2 text-sm">
                <div><dt class="text-base-content/50">Size</dt><dd class="font-medium">{{ opportunity.landSize }} {{ opportunity.landSizeUnit }}</dd></div>
                <div><dt class="text-base-content/50">Current Use</dt><dd>{{ opportunity.currentUse || '—' }}</dd></div>
                <div><dt class="text-base-content/50">Title Number</dt><dd>{{ opportunity.titleNumber || '—' }}</dd></div>
                <div><dt class="text-base-content/50">Post Code</dt><dd>{{ opportunity.postCode || '—' }}</dd></div>
              </dl>
            </div>
          </div>

          <!-- Financial Card -->
          <div class="card bg-base-100 shadow-sm border border-base-300">
            <div class="card-body">
              <h3 class="card-title text-sm">Financial</h3>
              <dl class="space-y-2 mt-2 text-sm">
                <div><dt class="text-base-content/50">Asking Price</dt><dd class="font-medium">{{ opportunity.askingPrice ? ('£' + (opportunity.askingPrice | number:'1.0-0')) : '—' }}</dd></div>
                <div><dt class="text-base-content/50">Estimated Value</dt><dd>{{ opportunity.estimatedValue ? ('£' + (opportunity.estimatedValue | number:'1.0-0')) : '—' }}</dd></div>
                <div><dt class="text-base-content/50">Dev Cost</dt><dd>{{ opportunity.estimatedDevelopmentCost ? ('£' + (opportunity.estimatedDevelopmentCost | number:'1.0-0')) : '—' }}</dd></div>
                <div><dt class="text-base-content/50">ROI</dt><dd>{{ opportunity.roi ? (opportunity.roi + '%') : '—' }}</dd></div>
              </dl>
            </div>
          </div>

          <!-- Source Card -->
          <div class="card bg-base-100 shadow-sm border border-base-300">
            <div class="card-body">
              <h3 class="card-title text-sm">Source & Agent</h3>
              <dl class="space-y-2 mt-2 text-sm">
                <div><dt class="text-base-content/50">Source</dt><dd>{{ opportunity.source || '—' }}</dd></div>
                <div><dt class="text-base-content/50">Agent</dt><dd>{{ opportunity.agentName || '—' }}</dd></div>
                <div><dt class="text-base-content/50">Owner</dt><dd>{{ opportunity.landOwnerName || '—' }}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      }

      @if (activeTab === 'dd') {
        <div class="card bg-base-100 shadow-sm border border-base-300 p-6">
          <p class="text-base-content/60">Due diligence checks will be listed here.</p>
        </div>
      }

      @if (activeTab === 'offers') {
        <div class="card bg-base-100 shadow-sm border border-base-300 p-6">
          <p class="text-base-content/60">Offer history will be listed here.</p>
        </div>
      }

      @if (activeTab === 'docs') {
        <div class="card bg-base-100 shadow-sm border border-base-300 p-6">
          <p class="text-base-content/60">Attached documents will be listed here.</p>
        </div>
      }

      <div class="mt-6">
        <a routerLink="/opportunities" class="btn btn-ghost btn-sm">← Back to List</a>
      </div>
    }
  `
})
export class OpportunityDetailComponent implements OnInit {
  opportunity: OpportunityDetail | null = null;
  loading = true;
  activeTab = 'details';

  constructor(
    private route: ActivatedRoute,
    private opportunityService: OpportunityService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.opportunityService.getById(id).subscribe({
        next: (response) => {
          this.opportunity = response.data;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
  }
}
