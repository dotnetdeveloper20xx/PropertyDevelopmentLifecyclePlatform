import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../shared/components/page-description/page-description.component';
import { AuthService } from '../../core/services/auth.service';

interface LearningPath {
  role: string;
  description: string;
  icon: string;
  steps: LearningStep[];
}

interface LearningStep {
  order: number;
  title: string;
  description: string;
  link: string;
  duration: string;
}

/**
 * Role-Based Learning Paths.
 * Provides tailored onboarding for each user role with ordered learning steps.
 * Highlights the current user's role path by default.
 */
@Component({
  selector: 'app-learning-paths',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, PageHeaderComponent, PageDescriptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      {label: 'Home', url: '/dashboard'},
      {label: 'Help Centre', url: '/help'},
      {label: 'Learning Paths'}
    ]"></app-breadcrumb>
    <app-page-header title="Role-Based Learning Paths" subtitle="Tailored guides based on your role"></app-page-header>
    <app-page-description
      description="Each role has a customised learning path to get you productive quickly. Find your role below and follow the steps in order."
      [guidance]="currentRoleGuidance"
    ></app-page-description>

    <div class="space-y-6">
      @for (path of paths; track path.role) {
        <div class="card bg-base-100 border border-base-300"
          [class.border-primary]="path.role === currentRole"
          [class.border-2]="path.role === currentRole">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">{{ path.icon }}</span>
              <div>
                <h3 class="font-bold text-base-content">{{ path.role }}</h3>
                <p class="text-sm text-base-content/60">{{ path.description }}</p>
              </div>
              @if (path.role === currentRole) {
                <span class="badge badge-primary ml-auto">Your Role</span>
              }
            </div>

            <div class="overflow-x-auto">
              <ul class="steps steps-vertical lg:steps-horizontal w-full">
                @for (step of path.steps; track step.order) {
                  <li class="step step-primary">
                    <a [routerLink]="step.link" class="text-left block hover:text-primary transition-colors">
                      <span class="text-xs font-medium block">{{ step.title }}</span>
                      <span class="text-xs text-base-content/50">{{ step.duration }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>

            <!-- Detailed steps -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              @for (step of path.steps; track step.order) {
                <a [routerLink]="step.link"
                   class="p-3 rounded-lg bg-base-200 hover:bg-primary/5 border border-transparent hover:border-primary/30 transition-all">
                  <div class="flex items-start gap-2">
                    <span class="badge badge-sm badge-primary">{{ step.order }}</span>
                    <div>
                      <p class="text-sm font-medium">{{ step.title }}</p>
                      <p class="text-xs text-base-content/50 mt-1">{{ step.description }}</p>
                      <span class="text-xs text-base-content/40">{{ step.duration }}</span>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        </div>
      }
    </div>

    <div class="mt-6">
      <a routerLink="/help" class="btn btn-ghost btn-sm">← Back to Help Centre</a>
    </div>
  `
})
export class LearningPathsComponent implements OnInit {
  currentRole = '';
  currentRoleGuidance = '';

  paths: LearningPath[] = [
    {
      role: 'Acquisition Manager',
      description: 'Find, evaluate, and secure land opportunities',
      icon: '🏗️',
      steps: [
        { order: 1, title: 'Platform Overview', description: 'Understand how BuildEstate Pro works', link: '/help/getting-started/gs-welcome', duration: '5 min' },
        { order: 2, title: 'Navigate the App', description: 'Learn the sidebar, breadcrumbs, and pages', link: '/help/getting-started/gs-navigation', duration: '3 min' },
        { order: 3, title: 'Create an Opportunity', description: 'Add your first land site', link: '/help/getting-started/gs-first-opportunity', duration: '5 min' },
        { order: 4, title: 'Understand the Pipeline', description: 'How opportunities flow through stages', link: '/help/land-acquisition/la-pipeline', duration: '5 min' },
        { order: 5, title: 'Run Due Diligence', description: 'Record legal and technical checks', link: '/help/land-acquisition/la-due-diligence', duration: '5 min' },
        { order: 6, title: 'Make Offers', description: 'Submit and track offer negotiations', link: '/help/land-acquisition/la-offers', duration: '4 min' }
      ]
    },
    {
      role: 'Finance Director',
      description: 'Monitor financial performance and approve investments',
      icon: '💰',
      steps: [
        { order: 1, title: 'Platform Overview', description: 'Understand the platform structure', link: '/help/getting-started/gs-welcome', duration: '5 min' },
        { order: 2, title: 'Dashboard & KPIs', description: 'Read the financial summary dashboard', link: '/help/modules/mod-dashboard', duration: '4 min' },
        { order: 3, title: 'Valuation & Feasibility', description: 'Understand ROI and financial metrics', link: '/help/land-acquisition/la-valuation', duration: '5 min' },
        { order: 4, title: 'Approval Workflows', description: 'How to review and approve items', link: '/help/workflows/wf-approvals', duration: '4 min' },
        { order: 5, title: 'Permissions', description: 'What you can access and approve', link: '/help/roles/roles-permissions', duration: '3 min' }
      ]
    },
    {
      role: 'Legal & Compliance Officer',
      description: 'Manage due diligence, contracts, and compliance',
      icon: '⚖️',
      steps: [
        { order: 1, title: 'Platform Overview', description: 'Get oriented with the platform', link: '/help/getting-started/gs-welcome', duration: '5 min' },
        { order: 2, title: 'Due Diligence', description: 'Record and manage legal checks', link: '/help/land-acquisition/la-due-diligence', duration: '5 min' },
        { order: 3, title: 'Audit Trail', description: 'Understand compliance logging', link: '/help/workflows/wf-audit-trail', duration: '4 min' },
        { order: 4, title: 'Status Transitions', description: 'How items move through approval', link: '/help/workflows/wf-status-transitions', duration: '4 min' },
        { order: 5, title: 'Roles & Permissions', description: 'Access control and data security', link: '/help/roles/roles-permissions', duration: '3 min' }
      ]
    },
    {
      role: 'Project Manager',
      description: 'Plan projects, manage budgets, and track timelines',
      icon: '📋',
      steps: [
        { order: 1, title: 'Platform Overview', description: 'Understand the full platform lifecycle', link: '/help/getting-started/gs-welcome', duration: '5 min' },
        { order: 2, title: 'Module Overview', description: 'See all 14 modules and how they connect', link: '/help/modules/mod-overview', duration: '5 min' },
        { order: 3, title: 'Dashboard', description: 'Monitor project KPIs', link: '/help/modules/mod-dashboard', duration: '4 min' },
        { order: 4, title: 'Workflows', description: 'Understand approval and escalation patterns', link: '/help/workflows/wf-approvals', duration: '4 min' },
        { order: 5, title: 'Roles', description: 'Team roles and responsibilities', link: '/help/roles/roles-overview', duration: '3 min' }
      ]
    },
    {
      role: 'Admin / Support',
      description: 'Documentation, data entry, and system support',
      icon: '🛠️',
      steps: [
        { order: 1, title: 'Platform Overview', description: 'Quick introduction to BuildEstate Pro', link: '/help/getting-started/gs-welcome', duration: '5 min' },
        { order: 2, title: 'Navigation', description: 'Learn the interface quickly', link: '/help/getting-started/gs-navigation', duration: '3 min' },
        { order: 3, title: 'Create Opportunities', description: 'How to enter land data', link: '/help/getting-started/gs-first-opportunity', duration: '5 min' },
        { order: 4, title: 'Pipeline Management', description: 'Understand statuses and workflows', link: '/help/land-acquisition/la-pipeline', duration: '5 min' },
        { order: 5, title: 'All Roles', description: 'Know who does what', link: '/help/roles/roles-overview', duration: '3 min' }
      ]
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.currentRole = user?.roles?.[0] ?? '';
    this.currentRoleGuidance = this.currentRole
      ? `Your role is "${this.currentRole}" — look for the highlighted path below.`
      : 'Log in to see your personalised learning path highlighted.';
  }
}
