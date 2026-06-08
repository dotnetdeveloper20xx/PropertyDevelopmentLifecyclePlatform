import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { ContractDetail, ContractStatus } from '../../../../core/models/legal.model';
import * as LegalActions from '../../store/legal.actions';
import * as LegalSelectors from '../../store/legal.selectors';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    PageHeaderComponent, BreadcrumbComponent, LoadingStateComponent,
    EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Legal & Compliance', url: '/legal/contracts'}, {label: 'Contracts', url: '/legal/contracts'}, {label: (contract$ | async)?.contractReference ?? 'Detail'}]"></app-breadcrumb>

    @if (loading$ | async) {
      <app-loading-state message="Loading contract details..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadData()"></app-error-state>
    } @else if (contract$ | async; as contract) {
      <app-page-header [title]="contract.contractReference" [subtitle]="contract.title">
        <div class="flex gap-2">
          <a [routerLink]="['/legal/contracts', contract.id, 'edit']" class="btn btn-primary btn-sm">Edit Contract</a>
          @if (canTerminate(contract.status)) {
            <button class="btn btn-error btn-sm" (click)="confirmTerminate()">Terminate</button>
          }
          @if (canWithdraw(contract.status)) {
            <button class="btn btn-warning btn-sm" (click)="confirmWithdraw()">Withdraw</button>
          }
        </div>
      </app-page-header>

      <!-- Key Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Status</p>
          <app-status-badge [status]="contract.status"></app-status-badge>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Contract Type</p>
          <p class="font-medium">{{ formatType(contract.contractType) }}</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Counterparty</p>
          <p class="font-medium">{{ contract.counterpartyName }}</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Value</p>
          <p class="font-medium">{{ contract.contractValue ? ('£' + (contract.contractValue | number:'1.0-0')) : '—' }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered mb-6">
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'details'" (click)="activeTab.set('details')">Details</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'documents'" (click)="activeTab.set('documents')">
          Documents ({{ contract.documentCount }})
        </button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'tasks'" (click)="activeTab.set('tasks')">
          Tasks ({{ contract.taskCount }})
        </button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'activity'" (click)="activeTab.set('activity')">Activity</button>
      </div>

      <!-- Details Tab -->
      @if (activeTab() === 'details') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div><span class="text-xs text-base-content/50">Linked Opportunity</span>
                <p><a [routerLink]="['/opportunities', contract.opportunityId]" class="link link-primary text-sm">{{ contract.opportunityName }}</a></p>
              </div>
              <div><span class="text-xs text-base-content/50">Contract Reference</span><p>{{ contract.contractReference }}</p></div>
              <div><span class="text-xs text-base-content/50">Counterparty Name</span><p>{{ contract.counterpartyName }}</p></div>
              <div><span class="text-xs text-base-content/50">Counterparty Contact</span><p>{{ contract.counterpartyContact ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Contract Value</span><p>{{ contract.contractValue ? ('£' + (contract.contractValue | number:'1.2-2')) : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Currency</span><p>{{ contract.currency }}</p></div>
              <div><span class="text-xs text-base-content/50">Start Date</span><p>{{ contract.startDate ? (contract.startDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">End Date</span><p>{{ contract.endDate ? (contract.endDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Exchange Date</span><p>{{ contract.exchangeDate ? (contract.exchangeDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Completion Date</span><p>{{ contract.completionDate ? (contract.completionDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Solicitor</span><p>{{ contract.solicitor ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Solicitor Firm</span><p>{{ contract.solicitorFirm ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Solicitor Email</span><p>{{ contract.solicitorEmail ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Created</span><p>{{ contract.createdAt | date:'medium' }}</p></div>
              <div><span class="text-xs text-base-content/50">Last Updated</span><p>{{ contract.updatedAt ? (contract.updatedAt | date:'medium') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Created By</span><p>{{ contract.createdBy }}</p></div>
            </div>

            @if (contract.keyTerms) {
              <div class="mt-4 pt-4 border-t border-base-300">
                <span class="text-xs text-base-content/50">Key Terms</span>
                <p class="whitespace-pre-wrap mt-1">{{ contract.keyTerms }}</p>
              </div>
            }

            @if (contract.notes) {
              <div class="mt-4 pt-4 border-t border-base-300">
                <span class="text-xs text-base-content/50">Notes</span>
                <p class="whitespace-pre-wrap mt-1">{{ contract.notes }}</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- Documents Tab -->
      @if (activeTab() === 'documents') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <app-empty-state
              title="No Documents Uploaded"
              message="Upload contracts, amendments, schedules, and other legal documents here. Documents are version-controlled and linked to this contract for easy retrieval.">
            </app-empty-state>
          </div>
        </div>
      }

      <!-- Tasks Tab -->
      @if (activeTab() === 'tasks') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <app-empty-state
              title="No Tasks Yet"
              message="Legal tasks related to this contract will appear here. Create tasks for due diligence items, signature chasing, or completion actions.">
            </app-empty-state>
          </div>
        </div>
      }

      <!-- Activity Tab -->
      @if (activeTab() === 'activity') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <app-empty-state
              title="Activity Timeline"
              message="All status changes, updates, and events for this contract are recorded here from the audit log.">
            </app-empty-state>
          </div>
        </div>
      }

      <!-- Terminate Confirmation Modal -->
      @if (showTerminateConfirm()) {
        <div class="modal modal-open" role="dialog" aria-modal="true">
          <div class="modal-box max-w-sm">
            <h3 class="font-bold text-lg">Terminate Contract</h3>
            <p class="py-4 text-base-content/70">Are you sure you want to terminate this contract? This action marks the contract as terminated and cannot be undone.</p>
            <div class="modal-action">
              <button class="btn btn-ghost btn-sm" (click)="showTerminateConfirm.set(false)">Cancel</button>
              <button class="btn btn-error btn-sm" (click)="terminate()">Confirm Termination</button>
            </div>
          </div>
          <div class="modal-backdrop" (click)="showTerminateConfirm.set(false)"></div>
        </div>
      }

      <!-- Withdraw Confirmation Modal -->
      @if (showWithdrawConfirm()) {
        <div class="modal modal-open" role="dialog" aria-modal="true">
          <div class="modal-box max-w-sm">
            <h3 class="font-bold text-lg">Withdraw Contract</h3>
            <p class="py-4 text-base-content/70">Are you sure you want to withdraw this contract? This will reset it back to Draft status.</p>
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
export class ContractDetailComponent implements OnInit {
  contract$: Observable<ContractDetail | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  activeTab = signal<'details' | 'documents' | 'tasks' | 'activity'>('details');
  showTerminateConfirm = signal(false);
  showWithdrawConfirm = signal(false);

  private contractId = '';

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.contract$ = this.store.select(LegalSelectors.selectSelectedContract);
    this.loading$ = this.store.select(LegalSelectors.selectSelectedLoading);
    this.error$ = this.store.select(LegalSelectors.selectLegalError);
  }

  ngOnInit(): void {
    this.contractId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadData();
  }

  loadData(): void {
    this.store.dispatch(LegalActions.loadContract({ id: this.contractId }));
  }

  formatType(type: string): string {
    return type.replace(/([A-Z])/g, ' $1').trim();
  }

  canTerminate(status: ContractStatus): boolean {
    return ['Draft', 'UnderReview', 'AwaitingSignature', 'Exchanged'].includes(status);
  }

  canWithdraw(status: ContractStatus): boolean {
    return ['UnderReview', 'AwaitingSignature'].includes(status);
  }

  confirmTerminate(): void {
    this.showTerminateConfirm.set(true);
  }

  terminate(): void {
    this.showTerminateConfirm.set(false);
    this.store.dispatch(LegalActions.changeContractStatus({ id: this.contractId, newStatus: 'Terminated' }));
  }

  confirmWithdraw(): void {
    this.showWithdrawConfirm.set(true);
  }

  withdraw(): void {
    this.showWithdrawConfirm.set(false);
    this.store.dispatch(LegalActions.changeContractStatus({ id: this.contractId, newStatus: 'Draft' }));
  }
}
