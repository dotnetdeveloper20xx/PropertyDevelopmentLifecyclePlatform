import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import {
  BudgetLineItem, TransactionItem,
  CreateBudgetLineRequest, BudgetLineCategory, TransactionType
} from '../../../core/models/finance.model';
import { exportToCsv } from '../../../shared/utils/csv-export';
import * as FinanceActions from '../store/finance.actions';
import * as FinanceSelectors from '../store/finance.selectors';

@Component({
  selector: 'app-finance-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Finance'}, {label: 'Budget & Transactions'}]"></app-breadcrumb>
    <app-page-header title="Finance & Budget Control" subtitle="Monitor budgets, track costs, and manage project financials">
      <button class="btn btn-primary btn-sm" (click)="toggleBudgetForm()">+ Add Budget Line</button>
    </app-page-header>
    <app-page-description
      description="Finance tracks budget allocations and transactions per project. Each budget line represents a cost category with an allocated amount. Transactions record actual income and expenditure against budget lines."
      guidance="Enter a Project ID below to load budget lines and transactions. Use the inline form to create new budget allocations or record transactions."
      helpLink="/help/finance/finance-overview"
    ></app-page-description>

    <!-- Project Selector -->
    <div class="flex items-center gap-3 mb-4">
      <label class="form-control w-full max-w-xs">
        <div class="label"><span class="label-text">Project ID</span></div>
        <div class="flex gap-2">
          <input type="text" class="input input-bordered input-sm flex-1"
            placeholder="Enter project ID to load financials"
            [(ngModel)]="projectId" (keyup.enter)="loadData()" aria-label="Project ID" />
          <button class="btn btn-sm btn-outline" [disabled]="!projectId" (click)="loadData()">Load</button>
        </div>
      </label>
      <button class="btn btn-ghost btn-xs" (click)="exportCsv()" aria-label="Export to CSV">📥 Export CSV</button>
    </div>

    <!-- Inline Budget Line Form -->
    @if (showBudgetForm) {
      <div class="card bg-base-200 border border-base-300 p-4 mb-4">
        <h3 class="font-semibold mb-3">New Budget Line</h3>
        <form [formGroup]="budgetForm" (ngSubmit)="onBudgetSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="form-control">
            <label class="label"><span class="label-text">Category *</span></label>
            <select class="select select-bordered select-sm" formControlName="category">
              <option value="">Select category...</option>
              <option value="Construction">Construction</option>
              <option value="Materials">Materials</option>
              <option value="Labour">Labour</option>
              <option value="Professional">Professional</option>
              <option value="Land">Land</option>
              <option value="Marketing">Marketing</option>
              <option value="Contingency">Contingency</option>
              <option value="Other">Other</option>
            </select>
            @if (budgetForm.get('category')?.touched && budgetForm.get('category')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Category is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Description *</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="description"
              placeholder="e.g. Foundation works" />
            @if (budgetForm.get('description')?.touched && budgetForm.get('description')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Description is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Allocated Amount *</span></label>
            <input type="number" class="input input-bordered input-sm" formControlName="allocatedAmount"
              placeholder="e.g. 500000" min="0" step="0.01" />
            @if (budgetForm.get('allocatedAmount')?.touched && budgetForm.get('allocatedAmount')?.hasError('required')) {
              <label class="label"><span class="label-text-alt text-error">Allocated amount is required</span></label>
            }
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Notes</span></label>
            <input type="text" class="input input-bordered input-sm" formControlName="notes"
              placeholder="Optional notes" />
          </div>
          <div class="col-span-full flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="budgetForm.invalid || !projectId">Create Budget Line</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="toggleBudgetForm()">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (budgetLoading$ | async) {
      <app-loading-state message="Loading budget lines..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadData()"></app-error-state>
    } @else if (!projectId) {
      <app-empty-state
        title="Select a Project"
        message="Enter a project ID above and click Load to view budget lines and transactions for that project.">
      </app-empty-state>
    } @else if ((budgetLines$ | async)?.length === 0) {
      <app-empty-state
        title="No Budget Lines Yet"
        message="Create your first budget line to begin tracking project finances. Budget lines represent cost categories such as construction, materials, labour, and professional fees.">
        <button class="btn btn-primary btn-sm" (click)="toggleBudgetForm()">Create Your First Budget Line</button>
      </app-empty-state>
    } @else {
      <!-- Budget Lines Table -->
      <h3 class="text-lg font-semibold mb-2">Budget Lines</h3>
      <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Budget lines">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Allocated</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (line of budgetLines$ | async; track line.id) {
                <tr class="hover">
                  <td><span class="badge badge-sm badge-outline">{{ line.category }}</span></td>
                  <td class="font-medium">{{ line.description }}</td>
                  <td class="font-mono text-sm">{{ line.currency }} {{ line.allocatedAmount | number:'1.2-2' }}</td>
                  <td class="font-mono text-sm">{{ line.currency }} {{ line.spentAmount | number:'1.2-2' }}</td>
                  <td class="font-mono text-sm" [class.text-error]="line.remainingAmount < 0">
                    {{ line.currency }} {{ line.remainingAmount | number:'1.2-2' }}
                  </td>
                  <td><app-status-badge [status]="line.status"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transactions Table -->
      <h3 class="text-lg font-semibold mb-2">Transactions</h3>
      @if (transactionsLoading$ | async) {
        <app-loading-state message="Loading transactions..."></app-loading-state>
      } @else if ((transactions$ | async)?.length === 0) {
        <div class="card bg-base-100 border border-base-300 p-6 text-center">
          <p class="text-base-content/60">No transactions recorded for this project yet.</p>
        </div>
      } @else {
        <div class="card bg-base-100 shadow-sm border border-base-300">
          <div class="overflow-x-auto">
            <table class="table table-zebra" aria-label="Transactions">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (tx of transactions$ | async; track tx.id) {
                  <tr class="hover">
                    <td class="text-xs text-base-content/50">{{ tx.transactionDate | date:'mediumDate' }}</td>
                    <td><span class="badge badge-sm" [class.badge-success]="tx.type === 'Income'" [class.badge-error]="tx.type === 'Expense'" [class.badge-info]="tx.type === 'Transfer'" [class.badge-warning]="tx.type === 'Adjustment'">{{ tx.type }}</span></td>
                    <td class="font-medium">{{ tx.description }}</td>
                    <td class="font-mono text-sm">{{ tx.currency }} {{ tx.amount | number:'1.2-2' }}</td>
                    <td class="text-xs font-mono">{{ tx.reference ?? '—' }}</td>
                    <td><app-status-badge [status]="tx.status"></app-status-badge></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    }
  `
})
export class FinanceListComponent implements OnInit {
  budgetLines$: Observable<BudgetLineItem[]>;
  budgetLoading$: Observable<boolean>;
  transactions$: Observable<TransactionItem[]>;
  transactionsLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  projectId = '';
  showBudgetForm = false;

  budgetForm = new FormGroup({
    category: new FormControl<BudgetLineCategory | ''>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    allocatedAmount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    notes: new FormControl('', { nonNullable: true })
  });

  constructor(private store: Store) {
    this.budgetLines$ = this.store.select(FinanceSelectors.selectBudgetLines);
    this.budgetLoading$ = this.store.select(FinanceSelectors.selectBudgetLinesLoading);
    this.transactions$ = this.store.select(FinanceSelectors.selectTransactions);
    this.transactionsLoading$ = this.store.select(FinanceSelectors.selectTransactionsLoading);
    this.error$ = this.store.select(FinanceSelectors.selectFinanceError);
  }

  ngOnInit(): void {}

  loadData(): void {
    if (!this.projectId) return;
    this.store.dispatch(FinanceActions.loadBudgetLines({ projectId: this.projectId }));
    this.store.dispatch(FinanceActions.loadTransactions({ projectId: this.projectId }));
  }

  exportCsv(): void {
    this.budgetLines$.subscribe(lines => {
      const headers = ['Category', 'Description', 'Currency', 'Allocated', 'Spent', 'Remaining', 'Status'];
      const rows = lines.map(l => [
        l.category,
        l.description,
        l.currency,
        l.allocatedAmount.toString(),
        l.spentAmount.toString(),
        l.remainingAmount.toString(),
        l.status
      ]);
      exportToCsv('budget-lines', headers, rows);
    }).unsubscribe();
  }

  toggleBudgetForm(): void {
    this.showBudgetForm = !this.showBudgetForm;
    if (!this.showBudgetForm) {
      this.budgetForm.reset();
    }
  }

  onBudgetSubmit(): void {
    if (this.budgetForm.invalid || !this.projectId) return;

    const formValue = this.budgetForm.getRawValue();
    const request: CreateBudgetLineRequest = {
      category: formValue.category as BudgetLineCategory,
      description: formValue.description,
      allocatedAmount: formValue.allocatedAmount ?? 0,
      notes: formValue.notes || undefined
    };

    this.store.dispatch(FinanceActions.createBudgetLine({ projectId: this.projectId, request }));
    this.budgetForm.reset();
    this.showBudgetForm = false;
  }
}
