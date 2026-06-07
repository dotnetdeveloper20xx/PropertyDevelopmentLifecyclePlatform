import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { OpportunityService } from '../../../../core/services/opportunity.service';
import { DueDiligenceService, DueDiligenceListItem, DueDiligenceType, DueDiligenceStatus } from '../../../../core/services/due-diligence.service';
import { OfferService, OfferListItem, OfferStatus } from '../../../../core/services/offer.service';
import { ActivityService, ActivityItem } from '../../../../core/services/activity.service';
import { ModalService } from '../../../../core/services/modal.service';
import { OpportunityDetail } from '../../../../core/models/opportunity.model';

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    LoadingStateComponent, StatusBadgeComponent, PageHeaderComponent,
    PageDescriptionComponent, BreadcrumbComponent, EmptyStateComponent,
    FormFieldComponent
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
        description="Full details of this land opportunity. Use the tabs below to manage due diligence checks, offers, and view activity history."
        guidance="Progress this opportunity by completing due diligence, then submitting an offer."
        helpLink="/help/land-acquisition/la-pipeline"
      ></app-page-description>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered mb-6" aria-label="Opportunity sections">
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'details'" (click)="switchTab('details')">Details</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'dd'" (click)="switchTab('dd')">Due Diligence ({{ dueDiligences.length }})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'offers'" (click)="switchTab('offers')">Offers ({{ offers.length }})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab === 'activity'" (click)="switchTab('activity')">Activity</button>
      </div>

      <!-- Details Tab -->
      @if (activeTab === 'details') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <!-- Due Diligence Tab -->
      @if (activeTab === 'dd') {
        @if (dueDiligences.length === 0 && !showDdForm()) {
          <app-empty-state title="No Due Diligence Checks Yet"
            message="Due diligence verifies this land is suitable for development. Add legal, environmental, planning, utilities, or valuation checks.">
            <div class="flex flex-col items-center gap-3">
              <button class="btn btn-primary btn-sm" (click)="showDdForm.set(true)">Add Due Diligence Check</button>
              <a routerLink="/help/land-acquisition/la-due-diligence" class="text-xs text-primary hover:underline">What is due diligence? →</a>
            </div>
          </app-empty-state>
        } @else {
          @if (!showDdForm()) {
            <div class="flex justify-end mb-4">
              <button class="btn btn-primary btn-sm" (click)="showDdForm.set(true)">+ Add Check</button>
            </div>
          }

          <!-- Create DD Form -->
          @if (showDdForm()) {
            <div class="card bg-base-100 border border-primary/30 shadow-sm mb-4">
              <div class="card-body">
                <h3 class="font-semibold text-base-content mb-3">New Due Diligence Check</h3>
                <form [formGroup]="ddForm" (ngSubmit)="createDueDiligence()">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <app-form-field label="Type" fieldId="ddType" [required]="true" helpTooltip="The category of check being performed">
                      <select id="ddType" formControlName="type" class="select select-bordered w-full">
                        <option value="">Select type...</option>
                        <option value="Legal">Legal</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Planning">Planning</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Valuation">Valuation</option>
                      </select>
                    </app-form-field>
                    <app-form-field label="Assigned To" fieldId="ddAssigned" helpTooltip="Person or firm responsible for this check">
                      <input id="ddAssigned" type="text" formControlName="assignedTo" class="input input-bordered w-full" placeholder="e.g., Smith & Partners" />
                    </app-form-field>
                    <app-form-field label="Notes" fieldId="ddNotes">
                      <input id="ddNotes" type="text" formControlName="notes" class="input input-bordered w-full" placeholder="Optional notes" />
                    </app-form-field>
                  </div>
                  <div class="flex justify-end gap-2 mt-4">
                    <button type="button" class="btn btn-ghost btn-sm" (click)="showDdForm.set(false)">Cancel</button>
                    <button type="submit" class="btn btn-primary btn-sm" [disabled]="ddForm.invalid">Create</button>
                  </div>
                </form>
              </div>
            </div>
          }

          <!-- DD List -->
          @if (dueDiligences.length > 0) {
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full" aria-label="Due diligence checks">
                <thead>
                  <tr><th>Type</th><th>Status</th><th>Assigned To</th><th>Risk</th><th>Date</th></tr>
                </thead>
                <tbody>
                  @for (dd of dueDiligences; track dd.id) {
                    <tr>
                      <td class="font-medium">{{ dd.type }}</td>
                      <td><span class="badge badge-sm" [class]="getDdStatusClass(dd.status)">{{ dd.status }}</span></td>
                      <td>{{ dd.assignedTo || '—' }}</td>
                      <td>{{ dd.riskLevel || '—' }}</td>
                      <td>{{ dd.reportDate ? (dd.reportDate | date:'mediumDate') : '—' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }
      }

      <!-- Offers Tab -->
      @if (activeTab === 'offers') {
        @if (offers.length === 0 && !showOfferForm()) {
          <app-empty-state title="No Offers Made Yet"
            message="Offers are submitted once due diligence is satisfactory. Record your offer amount, validity period, and conditions.">
            <div class="flex flex-col items-center gap-3">
              <button class="btn btn-primary btn-sm" (click)="showOfferForm.set(true)">Make an Offer</button>
              <a routerLink="/help/land-acquisition/la-offers" class="text-xs text-primary hover:underline">How do offers work? →</a>
            </div>
          </app-empty-state>
        } @else {
          @if (!showOfferForm()) {
            <div class="flex justify-end mb-4">
              <button class="btn btn-primary btn-sm" (click)="showOfferForm.set(true)">+ New Offer</button>
            </div>
          }

          <!-- Create Offer Form -->
          @if (showOfferForm()) {
            <div class="card bg-base-100 border border-primary/30 shadow-sm mb-4">
              <div class="card-body">
                <h3 class="font-semibold text-base-content mb-3">New Offer</h3>
                <form [formGroup]="offerForm" (ngSubmit)="createOffer()">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <app-form-field label="Amount (£)" fieldId="offerAmount" [required]="true" helpTooltip="The offer amount in GBP">
                      <input id="offerAmount" type="number" formControlName="amount" class="input input-bordered w-full" placeholder="e.g., 4200000" />
                    </app-form-field>
                    <app-form-field label="Valid Until" fieldId="offerValid" helpTooltip="Expiry date for this offer">
                      <input id="offerValid" type="date" formControlName="validUntil" class="input input-bordered w-full" />
                    </app-form-field>
                    <app-form-field label="Conditions" fieldId="offerConditions" helpTooltip="Any conditions attached to the offer">
                      <input id="offerConditions" type="text" formControlName="conditions" class="input input-bordered w-full" placeholder="e.g., Subject to planning" />
                    </app-form-field>
                  </div>
                  <div class="flex justify-end gap-2 mt-4">
                    <button type="button" class="btn btn-ghost btn-sm" (click)="showOfferForm.set(false)">Cancel</button>
                    <button type="submit" class="btn btn-primary btn-sm" [disabled]="offerForm.invalid">Submit Offer</button>
                  </div>
                </form>
              </div>
            </div>
          }

          <!-- Offers List -->
          @if (offers.length > 0) {
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full" aria-label="Offers">
                <thead>
                  <tr><th>Amount</th><th>Date</th><th>Valid Until</th><th>Status</th><th>Counter</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  @for (offer of offers; track offer.id) {
                    <tr>
                      <td class="font-medium">£{{ offer.amount | number:'1.0-0' }}</td>
                      <td>{{ offer.offerDate | date:'mediumDate' }}</td>
                      <td>{{ offer.validUntil ? (offer.validUntil | date:'mediumDate') : '—' }}</td>
                      <td><span class="badge badge-sm" [class]="getOfferStatusClass(offer.status)">{{ offer.status }}</span></td>
                      <td>{{ offer.counterOfferAmount ? ('£' + (offer.counterOfferAmount | number:'1.0-0')) : '—' }}</td>
                      <td>
                        @if (offer.status === 'UnderReview') {
                          <div class="flex gap-1">
                            <button class="btn btn-success btn-xs" (click)="changeOfferStatus(offer.id, 'Accepted')">Accept</button>
                            <button class="btn btn-error btn-xs" (click)="changeOfferStatus(offer.id, 'Rejected')">Reject</button>
                          </div>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }
      }

      <!-- Activity Tab -->
      @if (activeTab === 'activity') {
        @if (activities.length === 0) {
          <app-empty-state title="No Activity Yet"
            message="Activity will appear here once changes are made to this opportunity — status changes, due diligence updates, offers, and more.">
          </app-empty-state>
        } @else {
          <div class="space-y-3">
            @for (item of activities; track item.id) {
              <div class="flex items-start gap-3 p-3 bg-base-100 border border-base-300 rounded-lg">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  [class]="getActivityIcon(item.action)">
                  {{ getActivityEmoji(item.action) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-base-content">
                    <strong>{{ item.userName }}</strong>
                    {{ getActivityVerb(item.action) }}
                    <span class="text-base-content/60">{{ item.entityName }}</span>
                  </p>
                  @if (item.affectedColumns) {
                    <p class="text-xs text-base-content/50 mt-1">Changed: {{ item.affectedColumns }}</p>
                  }
                  <p class="text-xs text-base-content/40 mt-1">{{ item.timestamp | date:'medium' }}</p>
                </div>
              </div>
            }
          </div>
        }
      }

      <div class="mt-6">
        <a routerLink="/opportunities" class="btn btn-ghost btn-sm">← Back to List</a>
      </div>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center">
        <div class="text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-semibold">Opportunity Not Found</h3>
        <p class="text-base-content/60 mt-2">The requested opportunity could not be loaded.</p>
        <a routerLink="/opportunities" class="btn btn-primary btn-sm mt-4">Back to Opportunities</a>
      </div>
    }
  `
})
export class OpportunityDetailComponent implements OnInit {
  opportunity: OpportunityDetail | null = null;
  loading = true;
  activeTab = 'details';
  opportunityId = '';

  // Sub-resource data
  dueDiligences: DueDiligenceListItem[] = [];
  offers: OfferListItem[] = [];
  activities: ActivityItem[] = [];

  // Form visibility
  showDdForm = signal(false);
  showOfferForm = signal(false);

  // Forms
  ddForm: FormGroup;
  offerForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private ddService: DueDiligenceService,
    private offerService: OfferService,
    private activityService: ActivityService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {
    this.ddForm = this.fb.group({
      type: ['', Validators.required],
      assignedTo: [''],
      notes: ['']
    });
    this.offerForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      validUntil: [''],
      conditions: ['']
    });
  }

  ngOnInit(): void {
    this.opportunityId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.opportunityId) {
      this.loadOpportunity();
    } else {
      this.loading = false;
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'dd' && this.dueDiligences.length === 0) this.loadDueDiligences();
    if (tab === 'offers' && this.offers.length === 0) this.loadOffers();
    if (tab === 'activity' && this.activities.length === 0) this.loadActivity();
  }

  private loadOpportunity(): void {
    this.opportunityService.getById(this.opportunityId).subscribe({
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
  }

  private loadDueDiligences(): void {
    this.ddService.getByOpportunity(this.opportunityId).subscribe({
      next: (response) => {
        this.dueDiligences = response.data ?? [];
        this.cdr.markForCheck();
      }
    });
  }

  private loadOffers(): void {
    this.offerService.getByOpportunity(this.opportunityId).subscribe({
      next: (response) => {
        this.offers = response.data ?? [];
        this.cdr.markForCheck();
      }
    });
  }

  private loadActivity(): void {
    this.activityService.getByOpportunity(this.opportunityId).subscribe({
      next: (response) => {
        this.activities = response.data ?? [];
        this.cdr.markForCheck();
      }
    });
  }

  createDueDiligence(): void {
    if (this.ddForm.invalid) return;
    this.ddService.create(this.opportunityId, this.ddForm.value).subscribe({
      next: (response) => {
        if (response.data) this.dueDiligences = [response.data, ...this.dueDiligences];
        this.ddForm.reset();
        this.showDdForm.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  createOffer(): void {
    if (this.offerForm.invalid) return;
    const request = {
      ...this.offerForm.value,
      validUntil: this.offerForm.value.validUntil || undefined
    };
    this.offerService.create(this.opportunityId, request).subscribe({
      next: (response) => {
        if (response.data) this.offers = [response.data, ...this.offers];
        this.offerForm.reset();
        this.showOfferForm.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  changeOfferStatus(offerId: string, newStatus: OfferStatus): void {
    this.offerService.changeStatus(this.opportunityId, offerId, { newStatus }).subscribe({
      next: (response) => {
        if (response.data) {
          const idx = this.offers.findIndex(o => o.id === offerId);
          if (idx >= 0) this.offers[idx] = response.data;
          this.offers = [...this.offers];
          this.cdr.markForCheck();
        }
      }
    });
  }

  confirmWithdraw(): void {
    this.modalService.confirm({
      title: 'Withdraw Opportunity',
      message: `Are you sure you want to withdraw "${this.opportunity?.name}"? This removes it from the active pipeline.`,
      confirmText: 'Withdraw',
      cancelText: 'Keep Active',
      type: 'warning'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.opportunityService.changeStatus(this.opportunityId, 'Withdrawn').subscribe({
          next: () => this.router.navigate(['/opportunities'])
        });
      }
    });
  }

  confirmDelete(): void {
    this.modalService.confirm({
      title: 'Delete Opportunity',
      message: `Permanently delete "${this.opportunity?.name}"? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.opportunityService.delete(this.opportunityId).subscribe({
          next: () => this.router.navigate(['/opportunities'])
        });
      }
    });
  }

  getDdStatusClass(status: DueDiligenceStatus): string {
    const map: Record<string, string> = {
      'Pending': 'badge-ghost',
      'InProgress': 'badge-info',
      'Completed': 'badge-success',
      'Failed': 'badge-error'
    };
    return map[status] ?? 'badge-ghost';
  }

  getOfferStatusClass(status: OfferStatus): string {
    const map: Record<string, string> = {
      'UnderReview': 'badge-warning',
      'Accepted': 'badge-success',
      'Rejected': 'badge-error',
      'CounterOffered': 'badge-info',
      'Withdrawn': 'badge-ghost'
    };
    return map[status] ?? 'badge-ghost';
  }

  getActivityIcon(action: string): string {
    const map: Record<string, string> = {
      'Create': 'bg-success/20',
      'Update': 'bg-info/20',
      'Delete': 'bg-error/20'
    };
    return map[action] ?? 'bg-base-300';
  }

  getActivityEmoji(action: string): string {
    const map: Record<string, string> = { 'Create': '✨', 'Update': '✏️', 'Delete': '🗑️' };
    return map[action] ?? '📋';
  }

  getActivityVerb(action: string): string {
    const map: Record<string, string> = { 'Create': 'created', 'Update': 'updated', 'Delete': 'deleted' };
    return map[action] ?? action.toLowerCase();
  }
}
