import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Administration' },
      { label: 'Settings' }
    ]"></app-breadcrumb>

    <app-page-header title="System Settings" subtitle="Platform configuration, notifications, and integrations">
    </app-page-header>

    <app-page-description
      description="System Settings allows administrators to configure platform-wide behaviour including company information, notification preferences, email templates, integration connections, and security policies."
      guidance="Review the configuration categories below. Changes to settings take effect immediately across the platform."
      helpLink="/help/admin/settings-overview"
    ></app-page-description>

    <!-- Settings Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            General
          </h3>
          <p class="text-sm text-base-content/60">Company name, branding, timezone, and regional preferences.</p>
          <div class="mt-3 space-y-2">
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Company Name</span>
              <span class="text-sm font-medium">BuildEstate Pro Ltd</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Timezone</span>
              <span class="text-sm font-medium">Europe/London (UTC+0)</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Currency</span>
              <span class="text-sm font-medium">GBP (£)</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm">Date Format</span>
              <span class="text-sm font-medium">DD/MM/YYYY</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            Notifications
          </h3>
          <p class="text-sm text-base-content/60">Email notifications, in-app alerts, and digest preferences.</p>
          <div class="mt-3 space-y-2">
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Email Notifications</span>
              <span class="badge badge-sm badge-success">Enabled</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">In-App Alerts</span>
              <span class="badge badge-sm badge-success">Enabled</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Digest Mode</span>
              <span class="text-sm font-medium">Daily</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm">Critical Only</span>
              <span class="badge badge-sm badge-ghost">Disabled</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            Integrations
          </h3>
          <p class="text-sm text-base-content/60">Third-party connections and API configurations.</p>
          <div class="mt-3 space-y-2">
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Land Registry API</span>
              <span class="badge badge-sm badge-ghost">Not Connected</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Companies House</span>
              <span class="badge badge-sm badge-ghost">Not Connected</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Planning Portal</span>
              <span class="badge badge-sm badge-ghost">Not Connected</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm">Email Service (SMTP)</span>
              <span class="badge badge-sm badge-ghost">Not Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Security
          </h3>
          <p class="text-sm text-base-content/60">Authentication, password policies, and session management.</p>
          <div class="mt-3 space-y-2">
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Token Expiry</span>
              <span class="text-sm font-medium">60 minutes</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Lockout Threshold</span>
              <span class="text-sm font-medium">5 failed attempts</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-base-200">
              <span class="text-sm">Min Password Length</span>
              <span class="text-sm font-medium">8 characters</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm">Require Special Char</span>
              <span class="badge badge-sm badge-success">Yes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Card -->
    <div class="card bg-base-200 border border-base-300 p-5">
      <h3 class="font-semibold text-sm mb-2">About System Settings</h3>
      <p class="text-sm text-base-content/70">
        Settings displayed above reflect the current platform configuration as defined in the backend environment.
        In a future release, administrators will be able to modify these settings directly from this page.
        Currently, configuration changes are managed through environment variables and the application's appsettings.json file.
      </p>
    </div>
  `
})
export class SettingsComponent {}
