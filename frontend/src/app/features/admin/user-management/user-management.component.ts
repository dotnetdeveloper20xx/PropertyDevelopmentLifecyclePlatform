import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  lastLogin: string | null;
}

interface RoleDto {
  name: string;
  description: string;
}

interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    PageDescriptionComponent,
    BreadcrumbComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    StatusBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Administration' },
      { label: 'Users' }
    ]"></app-breadcrumb>

    <app-page-header title="User Management" subtitle="Create, manage and configure platform users and their role assignments">
    </app-page-header>

    <app-page-description
      description="Manage all platform users from this page. You can create new users, assign roles, activate or deactivate accounts, and view login activity. Each user must have at least one role to access the platform."
      guidance="Use the Create User button to add a new team member. Click Edit on any row to update their details, or use the Roles button to change their permissions. Deactivated users cannot log in but their data is preserved."
      helpLink="/help/admin/user-management"
    ></app-page-description>

    <!-- Loading State -->
    @if (loading) {
      <app-loading-state message="Loading users..."></app-loading-state>
    }

    <!-- Main Content -->
    @if (!loading) {
      <!-- Action Bar -->
      <div class="flex items-center justify-between mb-4">
        <div class="text-sm text-base-content/60">
          {{ users.length }} user{{ users.length !== 1 ? 's' : '' }} found
        </div>
        <button
          class="btn btn-primary btn-sm"
          (click)="toggleCreateForm()"
          [disabled]="showCreateForm"
          aria-label="Create new user"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create User
        </button>
      </div>

      <!-- Create User Form -->
      @if (showCreateForm) {
        <div class="card bg-base-100 border border-primary/30 shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title text-base text-primary">Create New User</h3>
            <p class="text-sm text-base-content/60 mb-4">Fill in the details below to create a new platform user. All fields are required.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label" for="create-firstName"><span class="label-text">First Name</span></label>
                <input
                  id="create-firstName"
                  type="text"
                  class="input input-bordered input-sm"
                  [(ngModel)]="createForm.firstName"
                  placeholder="Enter first name"
                />
              </div>
              <div class="form-control">
                <label class="label" for="create-lastName"><span class="label-text">Last Name</span></label>
                <input
                  id="create-lastName"
                  type="text"
                  class="input input-bordered input-sm"
                  [(ngModel)]="createForm.lastName"
                  placeholder="Enter last name"
                />
              </div>
              <div class="form-control">
                <label class="label" for="create-email"><span class="label-text">Email</span></label>
                <input
                  id="create-email"
                  type="email"
                  class="input input-bordered input-sm"
                  [(ngModel)]="createForm.email"
                  placeholder="user@company.com"
                />
              </div>
              <div class="form-control">
                <label class="label" for="create-password"><span class="label-text">Password</span></label>
                <input
                  id="create-password"
                  type="password"
                  class="input input-bordered input-sm"
                  [(ngModel)]="createForm.password"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>
            <!-- Roles Selection -->
            <div class="form-control mt-4">
              <label class="label"><span class="label-text font-medium">Assign Roles</span></label>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                @for (role of availableRoles; track role.name) {
                  <label class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-base-200 transition-colors">
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm checkbox-primary"
                      [checked]="createForm.roles.includes(role.name)"
                      (change)="toggleCreateRole(role.name)"
                    />
                    <span class="text-sm">{{ role.name }}</span>
                  </label>
                }
              </div>
            </div>
            <!-- Form Actions -->
            <div class="flex items-center gap-2 mt-6">
              <button
                class="btn btn-primary btn-sm"
                (click)="createUser()"
                [disabled]="!isCreateFormValid() || submitting"
              >
                @if (submitting) {
                  <span class="loading loading-spinner loading-xs"></span>
                }
                Create User
              </button>
              <button class="btn btn-ghost btn-sm" (click)="cancelCreate()">Cancel</button>
            </div>
          </div>
        </div>
      }

      <!-- Users Table -->
      @if (users.length === 0 && !showCreateForm) {
        <app-empty-state
          title="No Users Found"
          message="No users have been registered on the platform yet. Create your first user to get started."
        >
          <button class="btn btn-primary btn-sm" (click)="toggleCreateForm()">Create First User</button>
        </app-empty-state>
      }

      @if (users.length > 0) {
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body p-0">
            <div class="overflow-x-auto">
              <table class="table table-sm" aria-label="Platform users">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Active</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of users; track user.id) {
                    <!-- Display Row -->
                    @if (editingUserId !== user.id) {
                      <tr class="hover">
                        <td class="font-medium">{{ user.firstName }} {{ user.lastName }}</td>
                        <td class="text-sm text-base-content/70">{{ user.email }}</td>
                        <td>
                          <div class="flex flex-wrap gap-1">
                            @for (role of user.roles; track role) {
                              <span class="badge badge-xs badge-primary badge-outline">{{ role }}</span>
                            }
                          </div>
                        </td>
                        <td>
                          <span class="badge badge-sm" [class.badge-success]="user.isActive" [class.badge-error]="!user.isActive">
                            {{ user.isActive ? 'Yes' : 'No' }}
                          </span>
                        </td>
                        <td class="text-sm text-base-content/60">
                          {{ user.lastLogin ? formatDate(user.lastLogin) : 'Never' }}
                        </td>
                        <td>
                          <div class="flex items-center gap-1">
                            <button class="btn btn-ghost btn-xs" (click)="startEdit(user)" title="Edit user details">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                              Edit
                            </button>
                            <button
                              class="btn btn-ghost btn-xs"
                              (click)="toggleActive(user)"
                              [title]="user.isActive ? 'Deactivate user' : 'Activate user'"
                            >
                              @if (user.isActive) {
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                </svg>
                              } @else {
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                              }
                              {{ user.isActive ? 'Deactivate' : 'Activate' }}
                            </button>
                            <button class="btn btn-ghost btn-xs" (click)="startRoleEdit(user)" title="Manage roles">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                              </svg>
                              Roles
                            </button>
                          </div>
                        </td>
                      </tr>
                    }

                    <!-- Inline Edit Row -->
                    @if (editingUserId === user.id && !editingRoles) {
                      <tr class="bg-base-200/50">
                        <td colspan="6">
                          <div class="p-3">
                            <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Editing User</p>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div class="form-control">
                                <label class="label py-0" for="edit-firstName"><span class="label-text text-xs">First Name</span></label>
                                <input
                                  id="edit-firstName"
                                  type="text"
                                  class="input input-bordered input-sm"
                                  [(ngModel)]="editForm.firstName"
                                />
                              </div>
                              <div class="form-control">
                                <label class="label py-0" for="edit-lastName"><span class="label-text text-xs">Last Name</span></label>
                                <input
                                  id="edit-lastName"
                                  type="text"
                                  class="input input-bordered input-sm"
                                  [(ngModel)]="editForm.lastName"
                                />
                              </div>
                              <div class="form-control">
                                <label class="label py-0" for="edit-email"><span class="label-text text-xs">Email</span></label>
                                <input
                                  id="edit-email"
                                  type="email"
                                  class="input input-bordered input-sm"
                                  [(ngModel)]="editForm.email"
                                />
                              </div>
                            </div>
                            <div class="flex items-center gap-2 mt-3">
                              <button class="btn btn-primary btn-xs" (click)="saveEdit(user.id)" [disabled]="submitting">
                                @if (submitting) {
                                  <span class="loading loading-spinner loading-xs"></span>
                                }
                                Save Changes
                              </button>
                              <button class="btn btn-ghost btn-xs" (click)="cancelEdit()">Cancel</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    }

                    <!-- Inline Roles Edit Row -->
                    @if (editingUserId === user.id && editingRoles) {
                      <tr class="bg-base-200/50">
                        <td colspan="6">
                          <div class="p-3">
                            <p class="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Assign Roles for {{ user.firstName }} {{ user.lastName }}</p>
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              @for (role of availableRoles; track role.name) {
                                <label class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-base-200 transition-colors">
                                  <input
                                    type="checkbox"
                                    class="checkbox checkbox-sm checkbox-secondary"
                                    [checked]="editRolesSelection.includes(role.name)"
                                    (change)="toggleEditRole(role.name)"
                                  />
                                  <span class="text-sm">{{ role.name }}</span>
                                </label>
                              }
                            </div>
                            <div class="flex items-center gap-2 mt-4">
                              <button class="btn btn-secondary btn-xs" (click)="saveRoles(user.id)" [disabled]="submitting">
                                @if (submitting) {
                                  <span class="loading loading-spinner loading-xs"></span>
                                }
                                Save Roles
                              </button>
                              <button class="btn btn-ghost btn-xs" (click)="cancelEdit()">Cancel</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    }
  `
})
export class UserManagementComponent implements OnInit {
  users: UserDto[] = [];
  availableRoles: RoleDto[] = [];
  loading = true;
  submitting = false;
  showCreateForm = false;
  editingUserId: string | null = null;
  editingRoles = false;

  createForm: CreateUserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: []
  };

  editForm: UpdateUserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    isActive: true
  };

  editRolesSelection: string[] = [];

  private readonly baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  toggleCreateForm(): void {
    this.showCreateForm = true;
    this.cancelEdit();
    this.resetCreateForm();
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.resetCreateForm();
  }

  isCreateFormValid(): boolean {
    return (
      this.createForm.firstName.trim().length > 0 &&
      this.createForm.lastName.trim().length > 0 &&
      this.createForm.email.trim().length > 0 &&
      this.createForm.password.trim().length >= 8 &&
      this.createForm.roles.length > 0
    );
  }

  toggleCreateRole(roleName: string): void {
    const index = this.createForm.roles.indexOf(roleName);
    if (index === -1) {
      this.createForm.roles = [...this.createForm.roles, roleName];
    } else {
      this.createForm.roles = this.createForm.roles.filter(r => r !== roleName);
    }
  }

  createUser(): void {
    if (!this.isCreateFormValid()) return;
    this.submitting = true;

    this.http.post<UserDto>(`${this.baseUrl}/admin/users`, this.createForm).subscribe({
      next: (user) => {
        this.users = [...this.users, user];
        this.toast.success(`User ${user.firstName} ${user.lastName} created successfully.`);
        this.showCreateForm = false;
        this.resetCreateForm();
        this.submitting = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to create user. Please try again.');
        this.submitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  startEdit(user: UserDto): void {
    this.editingUserId = user.id;
    this.editingRoles = false;
    this.editForm = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive
    };
  }

  startRoleEdit(user: UserDto): void {
    this.editingUserId = user.id;
    this.editingRoles = true;
    this.editRolesSelection = [...user.roles];
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editingRoles = false;
  }

  toggleEditRole(roleName: string): void {
    const index = this.editRolesSelection.indexOf(roleName);
    if (index === -1) {
      this.editRolesSelection = [...this.editRolesSelection, roleName];
    } else {
      this.editRolesSelection = this.editRolesSelection.filter(r => r !== roleName);
    }
  }

  saveEdit(userId: string): void {
    this.submitting = true;

    this.http.put<UserDto>(`${this.baseUrl}/admin/users/${userId}`, this.editForm).subscribe({
      next: (updated) => {
        this.users = this.users.map(u => u.id === userId ? { ...u, ...updated } : u);
        this.toast.success('User details updated successfully.');
        this.editingUserId = null;
        this.submitting = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to update user. Please try again.');
        this.submitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  saveRoles(userId: string): void {
    this.submitting = true;

    this.http.put<UserDto>(`${this.baseUrl}/admin/users/${userId}/roles`, { roles: this.editRolesSelection }).subscribe({
      next: (updated) => {
        this.users = this.users.map(u => u.id === userId ? { ...u, roles: updated.roles ?? this.editRolesSelection } : u);
        this.toast.success('User roles updated successfully.');
        this.editingUserId = null;
        this.editingRoles = false;
        this.submitting = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to update roles. Please try again.');
        this.submitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  toggleActive(user: UserDto): void {
    const action = user.isActive ? 'deactivate' : 'activate';
    this.http.patch<UserDto>(`${this.baseUrl}/admin/users/${user.id}/${action}`, {}).subscribe({
      next: () => {
        this.users = this.users.map(u =>
          u.id === user.id ? { ...u, isActive: !user.isActive } : u
        );
        this.toast.success(`User ${user.firstName} ${user.lastName} ${action}d successfully.`);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || `Failed to ${action} user. Please try again.`);
        this.cdr.markForCheck();
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private loadData(): void {
    this.loading = true;

    // Load users and roles in parallel
    this.http.get<UserDto[]>(`${this.baseUrl}/admin/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toast.error('Failed to load users. Please refresh the page.');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    this.http.get<RoleDto[]>(`${this.baseUrl}/admin/roles`).subscribe({
      next: (roles) => {
        this.availableRoles = roles;
        this.cdr.markForCheck();
      },
      error: () => {
        // Fallback to hardcoded roles if API fails
        this.availableRoles = [
          { name: 'SuperAdmin', description: 'Full platform access' },
          { name: 'AcquisitionManager', description: 'Manages land acquisition' },
          { name: 'LegalOfficer', description: 'Legal and compliance' },
          { name: 'PlanningManager', description: 'Planning applications' },
          { name: 'ProjectManager', description: 'Project oversight' },
          { name: 'SiteManager', description: 'Construction management' },
          { name: 'SalesManager', description: 'Sales pipeline' },
          { name: 'CompletionManager', description: 'Handover and closeout' },
          { name: 'PropertyManager', description: 'Property operations' },
          { name: 'FinanceDirector', description: 'Financial oversight' },
          { name: 'ValuationAnalyst', description: 'Feasibility analysis' },
          { name: 'Surveyor', description: 'Technical assessments' },
          { name: 'Admin', description: 'Administrative support' }
        ];
        this.cdr.markForCheck();
      }
    });
  }

  private resetCreateForm(): void {
    this.createForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roles: []
    };
  }
}
