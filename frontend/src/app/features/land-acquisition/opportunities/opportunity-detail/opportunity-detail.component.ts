import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { OpportunityService } from '../../../../core/services/opportunity.service';
import { ModalService } from '../../../../core/services/modal.service';
import { OpportunityDetail } from '../../../../core/models/opportunity.model';

/**
 * Opportunity detail page with:
 * - Tabbed layout (Details, Due Diligence, Offers, Documents)
 * - Empty states with guidance on each sub-tab
 * - Confirmation dialogs on destructive actions (Withdraw, Delete)
 * - Contextual help links
 */
@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, LoadingStateComponent, StatusBadgeComponent,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent, EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading opportunity..."></app-loading-state>
    } @else if (opportunity) {
      <app-breadcrumb [items]="[
        {label: 'Home', url: '/dashboard'},
        {label: 'Opportunities', url: '/opportunities'},
        {label: opportunity.name}
      ]"></app-breadcrumb>
      <app-page-header [title]="opportunity.name" [subtitle]="opportunity.location">
        <div class="flex items-center gap-2">
          <app-status-badge [status]="opportunity.status"></app-status-badge>
          @if (opportunity.status !== 'Withdrawn' && opportunity.status !== 'Acquired') {
            <button class="btn btn-warning btn-xs" (click)="confirmWithdraw()">Withdraw</button>
          }
          <button class="btn btn-error btn-xs btn-outline" (click)="confirmDelete()">Delete</button>
        </div>
      </app-page-header>
      <app-page-description
        description="Full details of this land opportunity. Use the tabs below to view due diligence records, offers, and documents."
        guidance="Progress this opportunity by completing due diligence checks, then submitting an offer."
        helpLink="/help/land-acquisition/la-pipeline"
      ></app-page-description>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered mb-6" aria-label="Opportunity sections">
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'details'"
          (click)="activeTab = 'details'" [attr.aria-selected]="activeTab === 'details'"
          aria-controls="panel-details">Details</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'dd'"
          (click)="activeTab = 'dd'" [attr.aria-selected]="activeTab === 'dd'"
          aria-controls="panel-dd">Due Diligence ({{ opportunity.dueDiligenceCount }})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'offers'"
          (click)="activeTab = 'offers'" [attr.aria-selected]="activeTab === 'offers'"
          aria-controls="panel-offers">Offers ({{ opportunity.offerCount }})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'docs'"
          (click)="activeTab = 'docs'" [attr.aria-selected]="activeTab === 'docs'"
          aria-controls="panel-docs">Documents ({{ opportunity.documentCount }})</button>
      </div>

      <!-- Details Tab -->
      @if (activeTab === 'details') {
        <div id="panel-details" role="tabpanel">
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
        </div>
      }

      <!-- Due Diligence Tab -->
      @if (activeTab === 'dd') {
        <div id="panel-dd" role="tabpanel">
          @if (opportunity.dueDiligenceCount === 0) {
            <app-empty-state
              title="No Due Diligence Checks Yet"
              message="Due diligence checks verify that this land is suitable for development. Add legal, environmental, planning, utilities, or valuation checks to assess risk before making an offer.">
              <div class="flex flex-col items-center gap-3">
                <button class="btn btn-primary btn-sm">Add Due Diligence Check</button>
                <a routerLink="/help/land-acquisition/la-due-diligence" class="text-xs text-primary hover:underline">
                  What is due diligence? →
                </a>
              </div>
            </app-empty-state>
          } @else {
            <div class="card bg-base-100 shadow-sm border border-base-300 p-6">
              <p class="text-base-content/60">{{ opportunity.dueDiligenceCount }} due diligence check(s) recorded.</p>
            </div>
          }
        </div>
      }

      <!-- Offers Tab -->
      @if (activeTab === 'offers') {
        <div id="panel-offers" role="tabpanel">
          @if (opportunity.offerCount === 0) {
            <app-empty-state
              title="No Offers Made Yet"
              message="Offers are submitted once due diligence is satisfactory. Record your offer amount, date, and validity period to track negotiations with the seller.">
              <div class="flex flex-col items-center gap-3">
                <button class="btn btn-primary btn-sm">Make an Offer</button>
                <a routerLink="/help/land-acquisition/la-offers" class="text-xs text-primary hover:underline">
                  How do offers work? →
                </a>
              </div>
            </app-empty-state>
          } @else {
            <div class="card bg-base-100 shadow-sm border border-base-300 p-6">
              <p class="text-base-content/60">{{ opportunity.offerCount }} offer(s) recorded.</p>
            </div>
          }
        </div>
      }

      <!-- Documents Tab -->
      @if (activeTab === 'docs') {
        <div id="panel-docs" role="tabpanel">
          @if (opportunity.documentCount === 0) {
            <app-empty-state
              title="No Documents Attached"
              message="Attach relevant documents such as title deeds, search reports, environmental assessments, or planning documents to keep everything in one place.">
              <button class="btn btn-primary btn-sm">Upload Document</button>
            </app-empty-state>
          } @else {
            <div class="card bg-base-100 shadow-sm border border-base-300 p-6">
              <p class="text-base-content/60">{{ opportunity.documentCount }} document(s) attached.</p>
            </div>
          }
        </div>
      }

      <div class="mt-6">
        <a routerLink="/opportunities" class="btn btn-ghost btn-sm">← Back to List</a>
      </div>
    } @else {
      <!-- Error / Not Found -->
      <div class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center">
        <div class="text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-semibold">Opportunity Not Found</h3>
        <p class="text-base-content/60 mt-2">The requested opportunity could not be loaded. It may have been deleted or you may not have permission.</p>
        <a routerLink="/opportunities" class="btn btn-primary btn-sm mt-4">Back to Opportunities</a>
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
    private router: Router,
    private opportunityService: OpportunityService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.opportunityService.getById(id).subscribe({
        next: (response) => {
          this.opportunity = response.data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loading = false;
    }
  }

  /** Confirm before withdrawing — this removes the opportunity from the active pipeline */
  confirmWithdraw(): void {
    this.modalService.confirm({
      title: 'Withdraw Opportunity',
      message: `Are you sure you want to withdraw "${this.opportunity?.name}"? This will remove it from the active pipeline. The record will remain for historical reporting but will no longer be tracked.`,
      confirmText: 'Withdraw',
      cancelText: 'Keep Active',
      type: 'warning'
    }).subscribe(confirmed => {
      if (confirmed && this.opportunity) {
        // TODO: Dispatch withdraw action
        this.router.navigate(['/opportunities']);
      }
    });
  }

  /** Confirm before deleting — this is irreversible */
  confirmDelete(): void {
    this.modalService.confirm({
      title: 'Delete Opportunity',
      message: `Are you sure you want to permanently delete "${this.opportunity?.name}"? This action cannot be undone. All associated due diligence checks, offers, and documents will also be removed.`,
      confirmText: 'Delete Permanently',
      cancelText: 'Cancel',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed && this.opportunity) {
        // TODO: Dispatch delete action
        this.router.navigate(['/opportunities']);
      }
    });
  }
}
