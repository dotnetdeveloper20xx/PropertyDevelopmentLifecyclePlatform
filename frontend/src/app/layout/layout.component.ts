import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

/**
 * Application shell layout with sidebar navigation and header.
 * Container component — manages auth state and routing.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="drawer lg:drawer-open h-full">
      <input id="nav-drawer" type="checkbox" class="drawer-toggle" />

      <!-- Main Content -->
      <div class="drawer-content flex flex-col">
        <!-- Header -->
        <header class="navbar bg-base-100 border-b border-base-300 px-6">
          <div class="flex-none lg:hidden">
            <label for="nav-drawer" class="btn btn-square btn-ghost" aria-label="Open navigation">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div class="flex-1"></div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-base-content/70">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
            <div class="badge badge-primary">{{ currentUser?.roles?.[0] }}</div>
            <button class="btn btn-ghost btn-sm" (click)="logout()" aria-label="Sign out">Sign Out</button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6 bg-base-200 overflow-auto">
          <router-outlet />
        </main>
      </div>

      <!-- Sidebar -->
      <div class="drawer-side z-40">
        <label for="nav-drawer" class="drawer-overlay" aria-label="Close navigation"></label>
        <aside class="bg-neutral text-neutral-content w-64 min-h-full flex flex-col">
          <!-- Brand -->
          <div class="p-6 border-b border-neutral-focus">
            <h1 class="text-lg font-bold">BuildEstate Pro</h1>
            <p class="text-xs text-neutral-content/60 mt-1">Property Development Platform</p>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 p-4">
            <ul class="menu gap-1">
              <li>
                <a routerLink="/dashboard" routerLinkActive="active" aria-label="Dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/>
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a routerLink="/opportunities" routerLinkActive="active" aria-label="Opportunities">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  Opportunities
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  `
})
export class LayoutComponent {
  currentUser;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
