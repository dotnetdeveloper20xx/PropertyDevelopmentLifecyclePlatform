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
  status?: 'built' | 'partial' | 'planned';
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
                      <a [routerLink]="item.route" routerLinkActive="active" [attr.aria-label]="item.label" class="flex items-center justify-between">
                        <span class="flex items-center gap-2">
                          <span [innerHTML]="item.icon"></span>
                          {{ item.label }}
                        </span>
                        @if (item.status === 'planned') {
                          <span class="badge badge-ghost badge-xs">Planned</span>
                        } @else if (item.status === 'partial') {
                          <span class="badge badge-warning badge-xs">Partial</span>
                        }
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </nav>
          <!-- Sidebar footer -->
          <div class="p-4 border-t border-white/10">
            <p class="text-xs text-neutral-content/40 text-center">v1.2.0 — Legal & Compliance</p>
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

  /** Navigation grouped by logical sections — full future application map */
  navSections: NavSection[] = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Land Acquisition',
      items: [
        { label: 'Opportunities', route: '/opportunities', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>', status: 'built' },
        { label: 'Due Diligence', route: '/due-diligence', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>', status: 'partial' },
        { label: 'Dashboard', route: '/acquisition/dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>', status: 'partial' }
      ]
    },
    {
      label: 'Planning & Approvals',
      items: [
        { label: 'Applications', route: '/planning', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Legal & Compliance',
      items: [
        { label: 'Contracts', route: '/legal/contracts', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>', status: 'built' },
        { label: 'Compliance', route: '/legal/compliance', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>', status: 'partial' },
        { label: 'Tasks', route: '/legal/tasks', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Project Management',
      items: [
        { label: 'Projects', route: '/projects', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Design & Construction',
      items: [
        { label: 'Dashboard', route: '/construction', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>', status: 'built' },
        { label: 'Projects', route: '/construction/projects', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>', status: 'partial' },
        { label: 'Inspections', route: '/construction/inspections', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>', status: 'partial' }
      ]
    },
    {
      label: 'Procurement',
      items: [
        { label: 'Orders & Materials', route: '/procurement', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>', status: 'built' },
        { label: 'Contractors', route: '/contractors', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Finance',
      items: [
        { label: 'Budget & Costs', route: '/finance', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', status: 'built' },
        { label: 'Investors', route: '/investors', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Sales & Operations',
      items: [
        { label: 'Property Units', route: '/units', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>', status: 'built' },
        { label: 'Sales & Marketing', route: '/sales', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>', status: 'built' },
        { label: 'Rentals', route: '/rentals', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7h3a1 1 0 011 1v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8a1 1 0 011-1h3m8 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m8 0H7"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Knowledge',
      items: [
        { label: 'Documents', route: '/documents', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>', status: 'built' },
        { label: 'Reports', route: '/reports', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>', status: 'built' }
      ]
    },
    {
      label: 'Administration',
      items: [
        { label: 'Users', route: '/admin/users', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>', status: 'planned' },
        { label: 'Audit Log', route: '/admin/audit', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', status: 'built' },
        { label: 'Settings', route: '/admin/settings', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', status: 'planned' }
      ]
    },
    {
      label: 'Support',
      items: [
        { label: 'Help Centre', route: '/help', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', status: 'built' }
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
