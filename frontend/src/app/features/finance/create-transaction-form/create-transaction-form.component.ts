import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { FormProgressComponent, FormStep } from '../../../shared/components/form-progress/form-progress.component';
import { TransactionType } from '../../../core/models/finance.model';
import * as FinanceActions from '../store/finance.actions';
import * as FinanceSelectors from '../store/finance.selectors';

@Component({
  selector: 'app-create-transaction-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    FormFieldComponent, FormProgressComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      {label: 'Home', url: '/dashboard'},
      {label: 'Finance', url: '/finance'},
      {label: 'Create Transaction'}
    ]"></app-breadcrumb>

    <app-page-header title="Create Transaction" subtitle="Record a new financial transaction against a project">
      <a routerLink="/finance" class="btn btn-ghost btn-sm">← Back to Finance</a>
    </app-page-header>

    <app-page-description
      description="Record income, expenses, transfers, or adjustments against a project. Transactions are linked to budget lines and provide a full financial audit trail for cost control and reporting."
      guidance="Project ID, Transaction Type, Description, and Amount are required. The transaction will be created in Pending status for approval."
      helpLink="/help/finance/creating-transactions"
    ></app-page-description>

    <app-form-progress [steps]="formSteps()"></app-form-progress>

    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Step 1: Transaction Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
            1. Transaction Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Project ID" fieldId="projectId" [required]="true"
              helpTooltip="The project this transaction belongs to"
              [error]="form.get('projectId')?.touched && form.get('projectId')?.hasError('required') ? 'Please enter the project ID' : undefined">
              <input id="projectId" type="text" formControlName="projectId" class="input input-bordered w-full"
                [class.input-error]="form.get('projectId')?.invalid && form.get('projectId')?.touched"
                placeholder="e.g., paste the project GUID" />
            </app-form-field>

            <app-form-field label="Type" fieldId="type" [required]="true"
              helpTooltip="The category of this financial transaction"
              [error]="form.get('type')?.touched && form.get('type')?.hasError('required') ? 'Please select a transaction type' : undefined">
              <select id="type" formControlName="type" class="select select-bordered w-full"
                [class.select-error]="form.get('type')?.invalid && form.get('type')?.touched">
                <option value="">Select type...</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Transfer">Transfer</option>
                <option value="Adjustment">Adjustment</option>
              </select>
            </app-form-field>

            <app-form-field label="Description" fieldId="description" [required]="true"
              helpTooltip="A clear description of what this transaction is for"
              [error]="form.get('description')?.touched && form.get('description')?.hasError('required') ? 'Please enter a description' : undefined">
              <input id="description" type="text" formControlName="description" class="input input-bordered w-full"
                [class.input-error]="form.get('description')?.invalid && form.get('description')?.touched"
                placeholder="e.g., Phase 1 foundation materials payment" />
            </app-form-field>

            <app-form-field label="Amount (£)" fieldId="amount" [required]="true"
              helpTooltip="The monetary value of this transaction"
              [error]="form.get('amount')?.touched && form.get('amount')?.hasError('required') ? 'Please enter the amount' : undefined">
              <input id="amount" type="number" formControlName="amount" class="input input-bordered w-full"
                [class.input-error]="form.get('amount')?.invalid && form.get('amount')?.touched"
                step="0.01" placeholder="e.g., 15000.00" />
            </app-form-field>
          </div>

          <!-- Step 2: Additional Details -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            2. Additional Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <app-form-field label="Budget Line ID" fieldId="budgetLineId"
              helpTooltip="Link this transaction to a specific budget line for tracking">
              <input id="budgetLineId" type="text" formControlName="budgetLineId" class="input input-bordered w-full"
                placeholder="e.g., paste the budget line GUID" />
            </app-form-field>

            <app-form-field label="Reference" fieldId="reference"
              helpTooltip="External reference number (e.g., invoice number, receipt number)">
              <input id="reference" type="text" formControlName="reference" class="input input-bordered w-full"
                placeholder="e.g., INV-2024-0456" />
            </app-form-field>

            <app-form-field label="Transaction Date" fieldId="transactionDate"
              helpTooltip="The date the transaction occurred">
              <input id="transactionDate" type="date" formControlName="transactionDate" class="input input-bordered w-full" />
            </app-form-field>
          </div>

          <!-- Step 3: Notes -->
          <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4 mt-6">
            3. Notes
          </h3>
          <div class="space-y-4 mb-6">
            <app-form-field label="Notes" fieldId="notes"
              helpTooltip="Additional notes or context about this transaction">
              <textarea id="notes" formControlName="notes" class="textarea textarea-bordered w-full" rows="4"
                placeholder="e.g., Payment made via BACS transfer. Awaiting supplier confirmation."></textarea>
            </app-form-field>
          </div>

          @if (error$ | async; as error) {
            <div role="alert" class="alert alert-error mt-4">
              <span class="text-sm">{{ error }}</span>
            </div>
          }

          <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
            <a routerLink="/finance" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || (loading$ | async)"
              [class.loading]="loading$ | async">
              @if (!(loading$ | async)) { Create Transaction }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateTransactionFormComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      projectId: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      budgetLineId: [''],
      reference: [''],
      transactionDate: [''],
      notes: ['']
    });
    this.loading$ = this.store.select(FinanceSelectors.selectTransactionsLoading);
    this.error$ = this.store.select(FinanceSelectors.selectFinanceError);
  }

  formSteps(): FormStep[] {
    const detailsValid = !!this.form?.get('projectId')?.valid &&
      !!this.form?.get('type')?.valid &&
      !!this.form?.get('description')?.valid &&
      !!this.form?.get('amount')?.valid;
    const additionalValid = !!this.form?.get('budgetLineId')?.value ||
      !!this.form?.get('reference')?.value ||
      !!this.form?.get('transactionDate')?.value;
    const notesValid = !!this.form?.get('notes')?.value;

    return [
      { label: 'Transaction Details', completed: detailsValid, active: !detailsValid },
      { label: 'Additional Details', completed: additionalValid, active: detailsValid && !additionalValid },
      { label: 'Notes', completed: notesValid, active: detailsValid && additionalValid && !notesValid }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.store.dispatch(FinanceActions.createTransaction({
      projectId: value.projectId,
      request: {
        type: value.type as TransactionType,
        description: value.description,
        amount: value.amount,
        budgetLineId: value.budgetLineId || undefined,
        reference: value.reference || undefined,
        transactionDate: value.transactionDate || undefined,
        notes: value.notes || undefined
      }
    }));
  }
}
