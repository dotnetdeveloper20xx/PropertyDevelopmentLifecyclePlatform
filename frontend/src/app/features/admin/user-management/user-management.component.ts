import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserInfo } from '../../../core/models/auth.model';

interface RoleDefinition {
  name: string;
  description: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Administration' },
      { label: 'Users' }
    ]"></app-breadcrumb>

    <app-page-header title="User Management" subtitle="Manage platform users, roles, and access permissions">
    </app-page-header>

    <app-page-description
      description="User Management allows administrators to control who has access to the platform and what permissions they hold. Each user is assigned one or more roles that determine which modules and actions they can access."
      guidance="Below you can view the currently logged-in user details and all available platform roles. Full multi-user management (invitations, role assignments, deactivation) will be available in a future release."
      helpLink="/help/admin/user-management"
    ></app-page-description>

    <!-- Current User Card -->
    @if (currentUser) {
      <div class="card bg-base-100 border border-base-300 shadow-sm mb-6">
        <div class="card-body">
          <h3 class="card-title text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Current User
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <p class="text-xs text-base-content/50 uppercase tracking-wider">Name</p>
              <p class="font-medium">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
            </div>
            <div>
              <p class="text-xs text-base-content/50 uppercase tracking-wider">Email</p>
              <p class="font-medium">{{ currentUser.email }}</p>
            </div>
            <div>
              <p class="text-xs text-base-content/50 uppercase tracking-wider">Roles</p>
              <div class="flex flex-wrap gap-1 mt-1">
                @for (role of currentUser.roles; track role) {
                  <span class="badge badge-sm badge-primary badge-outline">{{ role }}</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Available Roles -->
    <div class="card bg-base-100 border border-base-300 shadow-sm mb-6">
      <div class="card-body">
        <h3 class="card-title text-base">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Platform Roles
        </h3>
        <p class="text-sm text-base-content/60 mb-3">
          The following roles are available in BuildEstate Pro. Each role provides access to specific modules and capabilities.
        </p>
        <div class="overflow-x-auto">
          <table class="table table-zebra table-sm" aria-label="Platform roles">
            <thead>
              <tr>
                <th>Role</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              @for (role of roles; track role.name) {
                <tr class="hover">
                  <td class="font-medium whitespace-nowrap">{{ role.name }}</td>
                  <td class="text-sm text-base-content/70">{{ role.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Coming Soon Card -->
    <div class="card bg-info/10 border border-info/30 shadow-sm">
      <div class="card-body">
        <h3 class="card-title text-base text-info">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Multi-User Management — Coming Soon
        </h3>
        <p class="text-sm text-base-content/70 mt-1">
          A future release will include full multi-user management capabilities:
        </p>
        <ul class="list-disc list-inside text-sm text-base-content/60 mt-2 space-y-1">
          <li>Invite new users via email</li>
          <li>Assign and change user roles</li>
          <li>Deactivate and reactivate user accounts</li>
          <li>View user activity logs and last login</li>
          <li>Manage team assignments per project</li>
          <li>Configure role-based permissions per module</li>
        </ul>
      </div>
    </div>
  `
})
export class UserManagementComponent {
  currentUser: UserInfo | null;

  readonly roles: RoleDefinition[] = [
    { name: 'SuperAdmin', description: 'Full platform access. Can manage all modules, users, and system configuration.' },
    { name: 'AcquisitionManager', description: 'Manages land opportunities, evaluations, and the acquisition pipeline.' },
    { name: 'LegalOfficer', description: 'Handles due diligence, compliance checks, contracts, and legal documentation.' },
    { name: 'PlanningManager', description: 'Manages planning applications, council approvals, and planning conditions.' },
    { name: 'ProjectManager', description: 'Oversees project planning, budgets, timelines, milestones, and resource allocation.' },
    { name: 'SiteManager', description: 'Manages on-site construction, tracks progress, inspections, and snagging.' },
    { name: 'SalesManager', description: 'Handles marketing, leads, viewings, reservations, and the sales pipeline.' },
    { name: 'CompletionManager', description: 'Coordinates handover, legal completion, and project closeout activities.' },
    { name: 'PropertyManager', description: 'Manages rental operations, tenants, leases, maintenance, and day-to-day property management.' },
    { name: 'FinanceDirector', description: 'Monitors financial performance, budgets, cash flow, profitability, and investor returns.' },
    { name: 'ValuationAnalyst', description: 'Conducts financial reviews, feasibility analysis, and investment appraisals.' },
    { name: 'Surveyor', description: 'Performs technical assessments, site surveys, and produces specialist reports.' },
    { name: 'Admin', description: 'Documentation, data entry, and general administrative support across modules.' }
  ];

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUser;
  }
}
