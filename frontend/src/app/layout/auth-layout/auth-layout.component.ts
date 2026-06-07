import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Authentication layout. Clean centered layout for login/register/forgot-password.
 * No sidebar, no header — just content centered on screen.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <router-outlet />
    </div>
  `
})
export class AuthLayoutComponent {}
