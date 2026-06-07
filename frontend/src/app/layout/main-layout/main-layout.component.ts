import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

/**
 * Main corporate layout. Sidebar + header + content area.
 * Used for all authenticated pages except wizards and full-screen views.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="drawer lg:drawer-open h-screen">
      <input id="nav-drawer" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col">
        <!-- Header -->
        <header class="navbar bg-base-100 border-b border-base-300 px-6 min-h-[4rem]">
          <div class="flex-none lg:hidden">
            <label for="nav-drawer" class="btn btn-ghost btn-sm btn-square" aria-label="Open navigation">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </label>
          </div>
          <div class="flex-1"></div>
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button class="btn btn-ghost btn-sm btn-square" (click)="toggleTheme()" aria-label="Toggle theme">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            <!-- User Info -->
            <div class="flex items-center gap-2">
              <app-avatar [name]="userName" size="sm"></app-avatar>
              <div class="hidden md:block">
                <p class="text-sm font-medium leading-none">{{ userName }}</p>
                <p class="text-xs text-base-content/50">{{ userRole }}</p>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" (click)="logout()" aria-label="Sign out">Sign Out</button>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 p-6 bg-base-200 overflow-auto">
          <router-outlet />
        </main>
      </div>

      <!-- Sidebar -->
      <div class="drawer-side z-40">
        <label for="nav-drawer" class="drawer-overlay" aria-label="Close navigation"></label>
        <aside class="bg-neutral text-neutral-content w-64 min-h-full flex flex-col">
          <div class="p-6 border-b border-white/10">
            <h1 class="text-lg font-bold">BuildEstate Pro</h1>
            <p class="text-xs text-neutral-content/60 mt-1">Property Development Platform</p>
          </div>
          <nav class="flex-1 p-4" aria-label="Main navigation">
            <ul class="menu gap-1">
              <li>
                <a routerLink="/dashboard" routerLinkActive="active" aria-label="Dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/></svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a routerLink="/opportunities" routerLinkActive="active" aria-label="Opportunities">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
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
export class MainLayoutComponent {
  userName: string;
  userRole: string;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {
    const user = this.authService.currentUser;
    this.userName = user ? `${user.firstName} ${user.lastName}` : 'User';
    this.userRole = user?.roles?.[0] ?? '';
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
