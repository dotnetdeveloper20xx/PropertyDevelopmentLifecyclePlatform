import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

interface PermissionDto {
  id: number;
  name: string;
  module: string;
  action: string;
}

interface RoleDto {
  id: string;
  name: string;
  description: string;
}

interface AssignmentDto {
  roleId: string;
  permissionId: number;
}

interface MatrixResponse {
  success: boolean;
  data: {
    roles: RoleDto[];
    permissions: PermissionDto[];
    assignments: AssignmentDto[];
  };
}

/**
 * Permission Matrix — Enterprise RBAC management.
 * Displays a roles (columns) × permissions (rows) grid.
 * SuperAdmin can toggle individual permission assignments per role.
 */
@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, PageDescriptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Permission Matrix" icon="shield"></app-page-header>
    <app-page-description
      description="Manage granular permissions for each role. Toggle checkboxes to grant or revoke access. Changes are saved immediately."
      guidance="Roles define job functions. Permissions control feature access. Changes take effect on next login.">
    </app-page-description>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="stat bg-base-100 rounded-lg shadow-sm p-4">
        <div class="stat-title text-xs">Total Roles</div>
        <div class="stat-value text-lg text-primary">{{ roles.length }}</div>
      </div>
      <div class="stat bg-base-100 rounded-lg shadow-sm p-4">
        <div class="stat-title text-xs">Total Permissions</div>
        <div class="stat-value text-lg text-secondary">{{ permissions.length }}</div>
      </div>
      <div class="stat bg-base-100 rounded-lg shadow-sm p-4">
        <div class="stat-title text-xs">Active Assignments</div>
        <div class="stat-value text-lg text-accent">{{ assignmentSet.size }}</div>
      </div>
      <div class="stat bg-base-100 rounded-lg shadow-sm p-4">
        <div class="stat-title text-xs">Modules</div>
        <div class="stat-value text-lg text-info">{{ modules.length }}</div>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex flex-wrap items-center gap-4 mb-4">
      <div class="form-control">
        <input
          type="text"
          class="input input-bordered input-sm w-64"
          placeholder="Filter permissions..."
          [(ngModel)]="filterText"
          (ngModelChange)="applyFilter()"
          aria-label="Filter permissions"
        />
      </div>
      <div class="form-control">
        <select class="select select-bordered select-sm" [(ngModel)]="filterModule" (ngModelChange)="applyFilter()" aria-label="Filter by module">
          <option value="">All Modules</option>
          @for (mod of modules; track mod) {
            <option [value]="mod">{{ mod }}</option>
          }
        </select>
      </div>
      <div class="text-xs text-base-content/50">
        Showing {{ filteredPermissions.length }} of {{ permissions.length }} permissions
      </div>
    </div>

    <!-- Loading State -->
    @if (loading) {
      <div class="flex items-center justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <span class="ml-3 text-base-content/70">Loading permission matrix...</span>
      </div>
    }

    <!-- Error State -->
    @if (error) {
      <div class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>{{ error }}</span>
        <button class="btn btn-ghost btn-sm" (click)="loadMatrix()">Retry</button>
      </div>
    }

    <!-- Matrix Table -->
    @if (!loading && !error && roles.length > 0) {
      <div class="bg-base-100 rounded-lg shadow-sm overflow-x-auto">
        <table class="table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th class="bg-base-200 z-20 min-w-[200px] sticky left-0">Permission</th>
              @for (role of roles; track role.id) {
                <th class="bg-base-200 text-center min-w-[100px]">
                  <div class="flex flex-col items-center gap-0.5">
                    <span class="font-semibold text-xs">{{ role.name }}</span>
                    @if (role.description) {
                      <span class="text-[10px] text-base-content/40 font-normal">{{ role.description }}</span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (perm of filteredPermissions; track perm.id; let i = $index) {
              <!-- Module group header -->
              @if (i === 0 || perm.module !== filteredPermissions[i - 1].module) {
                <tr>
                  <td [attr.colspan]="roles.length + 1" class="bg-base-200/50 font-bold text-xs uppercase tracking-wider text-primary py-2 sticky left-0">
                    {{ perm.module }}
                  </td>
                </tr>
              }
              <tr class="hover">
                <td class="sticky left-0 bg-base-100 z-10">
                  <div class="flex flex-col">
                    <span class="font-medium text-xs">{{ perm.action }}</span>
                    <span class="text-[10px] text-base-content/50">{{ perm.name }}</span>
                  </div>
                </td>
                @for (role of roles; track role.id) {
                  <td class="text-center">
                    <input
                      type="checkbox"
                      class="checkbox checkbox-xs checkbox-primary"
                      [checked]="hasPermission(role.id, perm.id)"
                      (change)="togglePermission(role.id, perm.id, $event)"
                      [disabled]="role.name === 'SuperAdmin'"
                      [attr.aria-label]="role.name + ' - ' + perm.name"
                    />
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div class="mt-4 flex items-center gap-4 text-xs text-base-content/60">
        <div class="flex items-center gap-1">
          <input type="checkbox" class="checkbox checkbox-xs checkbox-primary" checked disabled />
          <span>Granted</span>
        </div>
        <div class="flex items-center gap-1">
          <input type="checkbox" class="checkbox checkbox-xs" disabled />
          <span>Not granted</span>
        </div>
        <div class="flex items-center gap-1">
          <input type="checkbox" class="checkbox checkbox-xs checkbox-primary" checked disabled />
          <span class="text-base-content/40">SuperAdmin (always full access)</span>
        </div>
      </div>
    }

    <!-- Empty State -->
    @if (!loading && !error && roles.length === 0 && permissions.length === 0) {
      <div class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <h3 class="text-lg font-semibold">No Permissions Found</h3>
        <p class="text-base-content/60 mt-1">The permission matrix has not been seeded yet. Run the database seeder to populate roles and permissions.</p>
      </div>
    }
  `
})
export class PermissionMatrixComponent implements OnInit {
  roles: RoleDto[] = [];
  permissions: PermissionDto[] = [];
  filteredPermissions: PermissionDto[] = [];
  modules: string[] = [];
  assignmentSet = new Set<string>();

  loading = true;
  error = '';
  filterText = '';
  filterModule = '';

  private readonly baseUrl = environment.apiUrl;
  private pendingToggles = new Set<string>();

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMatrix();
  }

  loadMatrix(): void {
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.http.get<MatrixResponse>(`${this.baseUrl}/admin/permissions/matrix`).subscribe({
      next: (response) => {
        this.roles = response.data.roles;
        this.permissions = response.data.permissions;
        this.filteredPermissions = [...this.permissions];
        this.modules = [...new Set(this.permissions.map(p => p.module))];

        // Build assignment lookup set: "roleId:permId"
        this.assignmentSet.clear();
        for (const a of response.data.assignments) {
          this.assignmentSet.add(`${a.roleId}:${a.permissionId}`);
        }

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err?.error?.errors?.[0] ?? 'Failed to load permission matrix. Ensure you are logged in as SuperAdmin.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  hasPermission(roleId: string, permId: number): boolean {
    return this.assignmentSet.has(`${roleId}:${permId}`);
  }

  togglePermission(roleId: string, permId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const grant = checkbox.checked;
    const key = `${roleId}:${permId}`;

    // Prevent double-clicking
    if (this.pendingToggles.has(key)) return;
    this.pendingToggles.add(key);

    // Optimistic update
    if (grant) {
      this.assignmentSet.add(key);
    } else {
      this.assignmentSet.delete(key);
    }

    this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/admin/permissions/assign`, {
      roleId,
      permissionId: permId,
      grant
    }).subscribe({
      next: () => {
        this.pendingToggles.delete(key);
        // Silent success — the optimistic update is already applied
      },
      error: () => {
        // Revert optimistic update
        if (grant) {
          this.assignmentSet.delete(key);
        } else {
          this.assignmentSet.add(key);
        }
        checkbox.checked = !grant;
        this.pendingToggles.delete(key);
        this.toast.error('Failed to update permission. Please try again.');
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    this.filteredPermissions = this.permissions.filter(p => {
      const matchesText = !this.filterText ||
        p.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        p.action.toLowerCase().includes(this.filterText.toLowerCase()) ||
        p.module.toLowerCase().includes(this.filterText.toLowerCase());
      const matchesModule = !this.filterModule || p.module === this.filterModule;
      return matchesText && matchesModule;
    });
    this.cdr.markForCheck();
  }
}
