import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Login page component. Handles authentication form submission.
 * Uses DaisyUI card and form components.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-primary">BuildEstate Pro</h1>
            <p class="text-sm text-base-content/60 mt-2">Property Development Lifecycle Platform</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-control w-full">
              <label class="label" for="email">
                <span class="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="admin&#64;buildestate.co.uk"
                class="input input-bordered w-full"
                [class.input-error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                autocomplete="email"
              />
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                <label class="label"><span class="label-text-alt text-error">Email is required</span></label>
              }
            </div>

            <div class="form-control w-full mt-4">
              <label class="label" for="password">
                <span class="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="input input-bordered w-full"
                [class.input-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                autocomplete="current-password"
              />
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <label class="label"><span class="label-text-alt text-error">Password is required</span></label>
              }
            </div>

            @if (errorMessage) {
              <div role="alert" class="alert alert-error mt-4">
                <span class="text-sm">{{ errorMessage }}</span>
              </div>
            }

            <button
              type="submit"
              class="btn btn-primary w-full mt-6"
              [disabled]="loading || loginForm.invalid"
              [class.loading]="loading"
            >
              @if (!loading) { Sign In }
            </button>
          </form>
        </div>
      </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.errors?.[0] || 'Invalid email or password.';
        this.cdr.markForCheck();
      },
      complete: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }
}
