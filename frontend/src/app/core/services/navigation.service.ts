import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
  children?: NavItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Navigation and breadcrumb service.
 * Manages sidebar navigation items (grouped by section) and dynamic breadcrumbs.
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  private previousUrl = '';

  /** Flat list for backwards compatibility */
  readonly sidebarItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Opportunities', route: '/opportunities', icon: 'landscape', roles: ['SuperAdmin', 'AcquisitionManager', 'FinanceDirector'] },
    { label: 'Help Centre', route: '/help', icon: 'help' },
  ];

  /** Grouped navigation for the sidebar */
  readonly navSections: NavSection[] = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' }
      ]
    },
    {
      label: 'Land Acquisition',
      items: [
        { label: 'Opportunities', route: '/opportunities', icon: 'landscape', roles: ['SuperAdmin', 'AcquisitionManager', 'FinanceDirector'] }
      ]
    },
    {
      label: 'Support',
      items: [
        { label: 'Help Centre', route: '/help', icon: 'help' }
      ]
    }
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const nav = event as NavigationEnd;
      this.previousUrl = nav.url;
    });
  }

  setBreadcrumbs(items: BreadcrumbItem[]): void {
    this.breadcrumbsSubject.next(items);
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  navigateBack(): void {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
