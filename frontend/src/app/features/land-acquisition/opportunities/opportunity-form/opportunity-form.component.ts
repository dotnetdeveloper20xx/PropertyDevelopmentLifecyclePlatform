import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OpportunityService } from '../../../../core/services/opportunity.service';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h1>New Opportunity</h1>
    <mat-card>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="e.g. Riverside Land">
              @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                <mat-error>Name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" placeholder="e.g. London, UK">
              @if (form.get('location')?.hasError('required') && form.get('location')?.touched) {
                <mat-error>Location is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Land Size (Acres)</mat-label>
              <input matInput formControlName="landSize" type="number">
              @if (form.get('landSize')?.hasError('min') && form.get('landSize')?.touched) {
                <mat-error>Must be greater than 0</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Asking Price (£)</mat-label>
              <input matInput formControlName="askingPrice" type="number">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Source</mat-label>
              <input matInput formControlName="source" placeholder="e.g. Agent Referral">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Agent Name</mat-label>
              <input matInput formControlName="agentName">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="3"></textarea>
          </mat-form-field>

          @if (errorMessage) {
            <p class="error-text">{{ errorMessage }}</p>
          }

          <div class="form-actions">
            <button mat-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid">
              @if (loading) { <mat-spinner diameter="20"></mat-spinner> }
              @else { Create Opportunity }
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    h1 { color: #1a237e; margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
    .error-text { color: #f44336; font-size: 14px; }
  `]
})
export class OpportunityFormComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      landSize: [null, [Validators.required, Validators.min(0.01)]],
      askingPrice: [null],
      source: [''],
      agentName: [''],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.opportunityService.create(this.form.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/opportunities']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.errors?.[0] || 'Failed to create opportunity.';
      },
      complete: () => { this.loading = false; }
    });
  }

  cancel(): void {
    this.router.navigate(['/opportunities']);
  }
}
