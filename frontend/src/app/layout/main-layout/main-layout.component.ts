import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { GuidedTourService } from '../../core/services/guided-tour.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { GuidedTourComponent } from '../../shared/components/guided-tour/guided-tour.component';

interface NavSection {
  label: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

/**
 * Main corporate layout. Sidebar + header + content area.
 * Navigation is grouped by sections for discoverability.
 * Sign Out requires confirmation to prevent accidental logouts.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AvatarComponent, GuidedTourComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="drawer lg:drawer-open h-screen">
      <!-- Skip to content (keyboard accessibility) -->
      <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[10000] btn btn-primary btn-sm">
        Skip to main content
      </a>
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
            <!-- Help Link -->
            <a routerLink="/help" class="btn btn-ghost btn-sm btn-square" aria-label="Help Centre">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </a>
            <!-- User Info -->
            <div class="flex items-center gap-2">
              <app-avatar [name]="userName" size="sm"></app-avatar>
              <div class="hidden md:block">
                <p class="text-sm font-medium leading-none">{{ userName }}</p>
                <p class="text-xs text-base-content/50">{{ userRole }}</p>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" (click)="confirmLogout()" aria-label="Sign out">Sign Out</button>
          </div>
        </header>

        <!-- Content -->
        <main id="main-content" class="flex-1 p-6 bg-base-200 overflow-auto" tabindex="-1" role="main">
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
          <nav class="flex-1 p-4 overflow-y-auto" aria-label="Main navigation">
            @for (section of navSections; track section.label) {
              <div class="mb-4">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-content/40 px-3 mb-2">
                  {{ section.label }}
                </h3>
                <ul class="menu menu-sm gap-1">
                  @for (item of section.items; track item.route) {
                    <li>
                      <a [routerLink]="item.route" routerLinkActive="active" [attr.aria-label]="item.label">
                        <span [innerHTML]="item.icon"></span>
                        {{ item.label }}
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </nav>
          <!-- Sidebar footer -->
          <div class="p-4 border-t border-white/10">
            <p class="text-xs text-neutral-content/40 text-center">v1.1.0 — Planning & Approvals</p>
          </div>
        </aside>
      </div>
    </div>

    <!-- Sign Out Confirmation Modal -->
    @if (showLogoutConfirm()) {
      <div class="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <div class="modal-box max-w-sm">
          <h3 id="logout-title" class="font-bold text-lg">Sign Out</h3>
          <p class="py-4 text-base-content/70">Are you sure you want to sign out? Any unsaved changes will be lost.</p>
          <div class="modal-action">
            <button class="btn btn-ghost btn-sm" (click)="cancelLogout()">Cancel</button>
            <button class="btn btn-error btn-sm" (click)="logout()">Sign Out</button>
          </div>
        </div>
        <div class="modal-backdrop" (click)="cancelLogout()"></div>
      </div>
    }

    <!-- Guided Tour Overlay -->
    <app-guided-tour></app-guided-tour>
  `
})
export class MainLayoutComponent implements OnInit {
  userName: string;
  userRole: string;
  showLogoutConfirm = signal(false);

  /** Navigation grouped by logical sections */
  navSections: NavSection[] = [
    {
      label: 'Overview',
      items: [
        {
          label: 'Dashboard',
          route: '/dashboard',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>'
        }
      ]
    },
    {
      label: 'Land Acquisition',
      items: [
        {
          label: 'Opportunities',
          route: '/opportunities',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>'
        }
      ]
    },
    {
      label: 'Planning & Approvals',
      items: [
        {
          label: 'Applications',
          route: '/planning',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
        }
      ]
    },
    {
      label: 'Support',
      items: [
        {
          label: 'Help Centre',
          route: '/help',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
        }
      ]
    }
  ];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private tourService: GuidedTourService,
    private router: Router
  ) {
    const user = this.authService.currentUser;
    this.userName = user ? `${user.firstName} ${user.lastName}` : 'User';
    this.userRole = user?.roles?.[0] ?? '';
  }

  ngOnInit(): void {
    // Auto-start onboarding tour for first-time users
    if (!this.tourService.isTourCompleted) {
      // Small delay to let the page render first
      setTimeout(() => this.tourService.startOnboarding(), 500);
    }
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(true);
  }

  cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  logout(): void {
    this.showLogoutConfirm.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
