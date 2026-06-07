import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Permission checking service. Provides role-based access control checks.
 * Used by components, guards, and directives to show/hide UI elements.
 */
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(private authService: AuthService) {}

  get currentRoles(): string[] {
    return this.authService.currentUser?.roles ?? [];
  }

  hasRole(role: string): boolean {
    return this.currentRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.currentRoles.includes(role));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.currentRoles.includes(role));
  }

  get isSuperAdmin(): boolean {
    return this.hasRole('SuperAdmin');
  }

  get isAcquisitionManager(): boolean {
    return this.hasAnyRole(['SuperAdmin', 'AcquisitionManager']);
  }

  get isFinanceDirector(): boolean {
    return this.hasAnyRole(['SuperAdmin', 'FinanceDirector']);
  }

  canManageOpportunities(): boolean {
    return this.hasAnyRole(['SuperAdmin', 'AcquisitionManager']);
  }

  canViewOpportunities(): boolean {
    return this.hasAnyRole(['SuperAdmin', 'AcquisitionManager', 'FinanceDirector', 'LegalOfficer']);
  }

  canDeleteOpportunities(): boolean {
    return this.isSuperAdmin;
  }
}
