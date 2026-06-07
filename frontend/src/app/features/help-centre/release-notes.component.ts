import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../shared/components/page-description/page-description.component';

interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  improvements: string[];
  fixes: string[];
}

/**
 * Release Notes page within the Help Centre.
 * Keeps users informed of platform changes, new features, and fixes.
 */
@Component({
  selector: 'app-release-notes',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, PageHeaderComponent, PageDescriptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      {label: 'Home', url: '/dashboard'},
      {label: 'Help Centre', url: '/help'},
      {label: 'Release Notes'}
    ]"></app-breadcrumb>
    <app-page-header title="Release Notes" subtitle="What's new and improved in BuildEstate Pro"></app-page-header>
    <app-page-description
      description="Stay informed about new features, improvements, and fixes. Each release is documented here with details about what changed and why."
      guidance="Check this page after updates to learn about new capabilities available to you."
    ></app-page-description>

    <div class="space-y-6">
      @for (release of releases; track release.version) {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-3">
              <span class="badge badge-primary font-mono">v{{ release.version }}</span>
              <span class="text-sm text-base-content/50">{{ release.date }}</span>
            </div>
            <h3 class="text-lg font-bold text-base-content">{{ release.title }}</h3>

            @if (release.highlights.length > 0) {
              <div class="mt-4">
                <h4 class="text-sm font-semibold text-success uppercase tracking-wider mb-2">✨ New Features</h4>
                <ul class="list-disc list-inside text-sm text-base-content/70 space-y-1">
                  @for (item of release.highlights; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
            }

            @if (release.improvements.length > 0) {
              <div class="mt-4">
                <h4 class="text-sm font-semibold text-info uppercase tracking-wider mb-2">🔧 Improvements</h4>
                <ul class="list-disc list-inside text-sm text-base-content/70 space-y-1">
                  @for (item of release.improvements; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
            }

            @if (release.fixes.length > 0) {
              <div class="mt-4">
                <h4 class="text-sm font-semibold text-warning uppercase tracking-wider mb-2">🐛 Bug Fixes</h4>
                <ul class="list-disc list-inside text-sm text-base-content/70 space-y-1">
                  @for (item of release.fixes; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <div class="mt-6">
      <a routerLink="/help" class="btn btn-ghost btn-sm">← Back to Help Centre</a>
    </div>
  `
})
export class ReleaseNotesComponent {
  releases: ReleaseNote[] = [
    {
      version: '1.4.0',
      date: '7 June 2026',
      title: 'Module 3: Legal & Compliance',
      highlights: [
        'Contracts management — create, track, and manage legal contracts end-to-end',
        'Contract status state machine (Draft → Under Review → Awaiting Signature → Exchanged → Completed)',
        'Compliance Checks — AML, KYC, title verification, environmental, and more',
        'Legal Tasks — priority-based task management with due dates and inline status changes',
        'Risk level flagging on compliance checks (Low/Medium/High/Critical)',
        'Help Centre articles for Legal & Compliance module'
      ],
      improvements: [
        'Sidebar updated with Legal & Compliance section (Contracts + Tasks)',
        'Confirmation dialogs on contract termination and withdrawal',
        'Tabbed contract detail view (Details, Documents, Tasks, Activity)',
        'Toast notifications on all legal operations',
        'CSV export on contracts list',
        'Inline task creation form'
      ],
      fixes: []
    },
    {
      version: '1.3.0',
      date: '7 June 2026',
      title: 'Module 2: Planning & Approvals',
      highlights: [
        'Full Planning & Approvals module — track applications through their lifecycle',
        'Planning Conditions management — create, track, and discharge conditions',
        'Planning Appeals — submit and track appeals for refused applications',
        'State machine enforcement for planning application status transitions',
        'Planning Dashboard with KPIs (applications by status, pending conditions)',
        'Help Centre articles for Planning module'
      ],
      improvements: [
        'Sidebar updated with Planning & Approvals navigation section',
        'CSV export on planning applications list',
        'Tabbed detail view (Details, Conditions, Appeals, Activity)',
        'Confirmation dialog on application withdrawal',
        'Toast notifications on all planning operations'
      ],
      fixes: []
    },
    {
      version: '1.2.0',
      date: '7 June 2026',
      title: 'Help Centre & Enhanced UX',
      highlights: [
        'Help Centre with searchable knowledge base, FAQ, and glossary',
        'Guided onboarding tour for new users',
        'Contextual tooltips on all form fields',
        'Role-based learning paths',
        'Release Notes page (you\'re reading it!)',
        'User Bible — comprehensive platform guide'
      ],
      improvements: [
        'Sidebar navigation grouped by module sections',
        'Attention Needed section on dashboard highlights items requiring action',
        'Sign Out confirmation prevents accidental logouts',
        'Empty states on all sub-tabs with guidance and help links',
        'Form progress indicators show section completion',
        'Video tutorial placeholders in help articles'
      ],
      fixes: [
        'Keyboard navigation improved across all interactive elements',
        'ARIA labels added to all tabs, buttons, and navigation'
      ]
    },
    {
      version: '1.1.0',
      date: '1 June 2026',
      title: 'Security & Performance',
      highlights: [
        'JWT authentication with refresh token rotation',
        'Rate limiting on authentication endpoints',
        'Content Security Policy headers'
      ],
      improvements: [
        'Pipeline stats computed via SQL aggregation (faster dashboard)',
        'Concurrency control with optimistic locking',
        'Health check endpoint for monitoring',
        'Dead code removal and bundle optimization'
      ],
      fixes: [
        'Fixed token expiry handling in HTTP interceptor',
        'Fixed correlation ID propagation in nested API calls'
      ]
    },
    {
      version: '1.0.0',
      date: '25 May 2026',
      title: 'Initial Release — Land Acquisition Module',
      highlights: [
        'Full .NET + Angular project scaffolding',
        'Land Acquisition CQRS with full CRUD and state machine',
        'Authentication API with JWT tokens',
        'Database with EF Core migrations',
        'Frontend platform: Tailwind + DaisyUI, NgRx, 24 shared components',
        'Design system with corporate theme'
      ],
      improvements: [],
      fixes: []
    }
  ];
}
