import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { PlanningApplicationDetail, PlanningCondition, PlanningAppeal, PlanningApplicationStatus } from '../../../core/models/planning.model';
import * as PlanningActions from '../store/planning.actions';
import * as PlanningSelectors from '../store/planning.selectors';

@Component({
  selector: 'app-planning-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    PageHeaderComponent, BreadcrumbComponent, LoadingStateComponent,
    EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Planning', url: '/planning'}, {label: (application$ | async)?.applicationReference ?? 'Detail'}]"></app-breadcrumb>

    @if (loading$ | async) {
      <app-loading-state message="Loading application details..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadData()"></app-error-state>
    } @else if (application$ | async; as app) {
      <app-page-header [title]="app.applicationReference" [subtitle]="app.description">
        <div class="flex gap-2">
          <a [routerLink]="['/planning', app.id, 'edit']" class="btn btn-ghost btn-sm">Edit</a>
          @if (canWithdraw(app.status)) {
            <button class="btn btn-warning btn-sm" (click)="confirmWithdraw()">Withdraw</button>
          }
        </div>
      </app-page-header>

      <!-- Status & Key Info -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Status</p>
          <app-status-badge [status]="app.status"></app-status-badge>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Local Authority</p>
          <p class="font-medium">{{ app.localAuthority }}</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Application Type</p>
          <p class="font-medium">{{ app.applicationType }}</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Linked Opportunity</p>
          <a [routerLink]="['/opportunities', app.opportunityId]" class="link link-primary text-sm">{{ app.opportunityName }}</a>
        </div>
      </div>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered mb-6">
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'details'" (click)="activeTab.set('details')">Details</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'conditions'" (click)="selectConditionsTab()">
          Conditions ({{ app.conditionCount }})
        </button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'appeals'" (click)="selectAppealsTab()">
          Appeals ({{ app.appealCount }})
        </button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'activity'" (click)="activeTab.set('activity')">Activity</button>
      </div>

      <!-- Details Tab -->
      @if (activeTab() === 'details') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div><span class="text-xs text-base-content/50">Submission Date</span><p>{{ app.submissionDate ? (app.submissionDate | date:'mediumDate') : 'Not yet submitted' }}</p></div>
              <div><span class="text-xs text-base-content/50">Validation Date</span><p>{{ app.validationDate ? (app.validationDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Decision Date</span><p>{{ app.decisionDate ? (app.decisionDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Expiry Date</span><p>{{ app.expiryDate ? (app.expiryDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Planning Officer</span><p>{{ app.planningOfficer ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Case Officer Email</span><p>{{ app.caseOfficerEmail ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Ward</span><p>{{ app.ward ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Site Address</span><p>{{ app.siteAddress ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Application Fee</span><p>{{ app.applicationFee ? ('£' + (app.applicationFee | number:'1.2-2')) : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Decision Notice</span><p>{{ app.decisionNotice ?? '—' }}</p></div>
            </div>
            @if (app.notes) {
              <div class="mt-4 pt-4 border-t border-base-300">
                <span class="text-xs text-base-content/50">Notes</span>
                <p class="whitespace-pre-wrap">{{ app.notes }}</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- Conditions Tab -->
      @if (activeTab() === 'conditions') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold">Planning Conditions</h3>
              <button class="btn btn-primary btn-sm" (click)="showConditionForm.set(true)">+ Add Condition</button>
            </div>

            @if (showConditionForm()) {
              <div class="p-4 mb-4 border border-base-300 rounded-lg bg-base-200">
                <form [formGroup]="conditionForm" (ngSubmit)="createCondition()">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" formControlName="title" class="input input-bordered w-full" placeholder="Condition title" />
                    <input type="text" formControlName="assignedTo" class="input input-bordered w-full" placeholder="Assigned to (optional)" />
                  </div>
                  <textarea formControlName="description" class="textarea textarea-bordered w-full mt-3" rows="2" placeholder="Condition description"></textarea>
                  <div class="flex gap-2 mt-3">
                    <button type="submit" class="btn btn-primary btn-sm" [disabled]="conditionForm.invalid">Save Condition</button>
                    <button type="button" class="btn btn-ghost btn-sm" (click)="showConditionForm.set(false)">Cancel</button>
                  </div>
                </form>
              </div>
            }

            @if ((conditions$ | async)?.length === 0) {
              <app-empty-state
                title="No Conditions"
                message="This application has no conditions attached. Conditions are typically added when an application is approved with conditions.">
              </app-empty-state>
            } @else {
              <div class="overflow-x-auto">
                <table class="table table-sm" aria-label="Planning conditions">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (condition of conditions$ | async; track condition.id) {
                      <tr>
                        <td>{{ condition.conditionNumber }}</td>
                        <td>{{ condition.title }}</td>
                        <td><app-status-badge [status]="condition.status"></app-status-badge></td>
                        <td>{{ condition.dueDate ? (condition.dueDate | date:'mediumDate') : '—' }}</td>
                        <td>{{ condition.assignedTo ?? '—' }}</td>
                        <td>
                          @if (condition.status !== 'Discharged') {
                            <button class="btn btn-ghost btn-xs" (click)="discharge(condition.id, false)">Discharge</button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      }

      <!-- Appeals Tab -->
      @if (activeTab() === 'appeals') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold">Appeals</h3>
              @if (app.status === 'Refused') {
                <button class="btn btn-primary btn-sm" (click)="showAppealForm.set(true)">+ Submit Appeal</button>
              }
            </div>

            @if ((appeals$ | async)?.length === 0) {
              <app-empty-state
                title="No Appeals"
                message="No appeals have been submitted for this application. Appeals can only be submitted after an application is refused.">
              </app-empty-state>
            } @else {
              <div class="space-y-3">
                @for (appeal of appeals$ | async; track appeal.id) {
                  <div class="border border-base-300 rounded-lg p-4">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-medium">{{ appeal.appealReference }}</p>
                        <p class="text-sm text-base-content/60">{{ appeal.grounds }}</p>
                      </div>
                      <app-status-badge [status]="appeal.status"></app-status-badge>
                    </div>
                    <div class="flex gap-4 mt-2 text-xs text-base-content/50">
                      <span>Filed: {{ appeal.appealDate | date:'mediumDate' }}</span>
                      @if (appeal.hearingDate) { <span>Hearing: {{ appeal.hearingDate | date:'mediumDate' }}</span> }
                      @if (appeal.inspector) { <span>Inspector: {{ appeal.inspector }}</span> }
                    </div>
                  </div>
                }
              </div>
            }

            @if (showAppealForm()) {
              <div class="p-4 mt-4 border border-base-300 rounded-lg bg-base-200">
                <form [formGroup]="appealForm" (ngSubmit)="createAppeal()">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" formControlName="appealReference" class="input input-bordered w-full" placeholder="Appeal reference (e.g., APP/2024/001)" />
                    <input type="text" formControlName="inspector" class="input input-bordered w-full" placeholder="Inspector name (optional)" />
                  </div>
                  <textarea formControlName="grounds" class="textarea textarea-bordered w-full mt-3" rows="3" placeholder="Grounds for appeal"></textarea>
                  <div class="flex gap-2 mt-3">
                    <button type="submit" class="btn btn-primary btn-sm" [disabled]="appealForm.invalid">Submit Appeal</button>
                    <button type="button" class="btn btn-ghost btn-sm" (click)="showAppealForm.set(false)">Cancel</button>
                  </div>
                </form>
              </div>
            }
          </div>
        </div>
      }

      <!-- Activity Tab -->
      @if (activeTab() === 'activity') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <app-empty-state
              title="Activity Timeline"
              message="Activity tracking shows all changes, status updates, and events for this application. This data is populated from the audit log.">
            </app-empty-state>
          </div>
        </div>
      }

      <!-- Withdraw Confirmation Modal -->
      @if (showWithdrawConfirm()) {
        <div class="modal modal-open" role="dialog" aria-modal="true">
          <div class="modal-box max-w-sm">
            <h3 class="font-bold text-lg">Withdraw Application</h3>
            <p class="py-4 text-base-content/70">Are you sure you want to withdraw this planning application? This action is final and cannot be undone.</p>
            <div class="modal-action">
              <button class="btn btn-ghost btn-sm" (click)="showWithdrawConfirm.set(false)">Cancel</button>
              <button class="btn btn-warning btn-sm" (click)="withdraw()">Confirm Withdrawal</button>
            </div>
          </div>
          <div class="modal-backdrop" (click)="showWithdrawConfirm.set(false)"></div>
        </div>
      }
    }
  `
})
export class PlanningDetailComponent implements OnInit {
  application$: Observable<PlanningApplicationDetail | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  conditions$: Observable<PlanningCondition[]>;
  appeals$: Observable<PlanningAppeal[]>;

  activeTab = signal<'details' | 'conditions' | 'appeals' | 'activity'>('details');
  showConditionForm = signal(false);
  showAppealForm = signal(false);
  showWithdrawConfirm = signal(false);

  conditionForm: FormGroup;
  appealForm: FormGroup;
  private applicationId = '';

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.application$ = this.store.select(PlanningSelectors.selectSelectedApplication);
    this.loading$ = this.store.select(PlanningSelectors.selectSelectedLoading);
    this.error$ = this.store.select(PlanningSelectors.selectPlanningError);
    this.conditions$ = this.store.select(PlanningSelectors.selectConditions);
    this.appeals$ = this.store.select(PlanningSelectors.selectAppeals);

    this.conditionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      assignedTo: ['']
    });

    this.appealForm = this.fb.group({
      appealReference: ['', Validators.required],
      grounds: ['', Validators.required],
      inspector: ['']
    });
  }

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadData();
  }

  loadData(): void {
    this.store.dispatch(PlanningActions.loadApplication({ id: this.applicationId }));
  }

  selectConditionsTab(): void {
    this.activeTab.set('conditions');
    this.store.dispatch(PlanningActions.loadConditions({ applicationId: this.applicationId }));
  }

  selectAppealsTab(): void {
    this.activeTab.set('appeals');
    this.store.dispatch(PlanningActions.loadAppeals({ applicationId: this.applicationId }));
  }

  canWithdraw(status: PlanningApplicationStatus): boolean {
    return ['PreApplication', 'Submitted', 'Validated', 'UnderReview', 'CommitteeReview'].includes(status);
  }

  confirmWithdraw(): void {
    this.showWithdrawConfirm.set(true);
  }

  withdraw(): void {
    this.showWithdrawConfirm.set(false);
    this.store.dispatch(PlanningActions.changeStatus({ id: this.applicationId, newStatus: 'Withdrawn' }));
  }

  createCondition(): void {
    if (this.conditionForm.invalid) return;
    this.store.dispatch(PlanningActions.createCondition({
      applicationId: this.applicationId,
      request: this.conditionForm.value
    }));
    this.conditionForm.reset();
    this.showConditionForm.set(false);
  }

  discharge(conditionId: string, partial: boolean): void {
    this.store.dispatch(PlanningActions.dischargeCondition({
      applicationId: this.applicationId,
      conditionId,
      request: { partialDischarge: partial }
    }));
  }

  createAppeal(): void {
    if (this.appealForm.invalid) return;
    this.store.dispatch(PlanningActions.createAppeal({
      applicationId: this.applicationId,
      request: this.appealForm.value
    }));
    this.appealForm.reset();
    this.showAppealForm.set(false);
  }
}
