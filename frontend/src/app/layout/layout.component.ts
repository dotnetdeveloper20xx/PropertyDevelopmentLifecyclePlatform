import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="brand">
          <h2>BuildEstate Pro</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/opportunities" routerLinkActive="active">
            <mat-icon matListItemIcon>landscape</mat-icon>
            <span matListItemTitle>Opportunities</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span class="toolbar-spacer"></span>
          <span class="user-info">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
          <button mat-icon-button (click)="logout()">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>
        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav { width: 250px; background: #1a237e; }
    .sidenav .brand { padding: 24px 16px; color: white; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .sidenav .brand h2 { margin: 0; font-size: 18px; }
    .sidenav mat-nav-list a { color: rgba(255,255,255,0.8); }
    .sidenav mat-nav-list a.active { color: white; background: rgba(255,255,255,0.1); }
    .sidenav mat-nav-list mat-icon { color: rgba(255,255,255,0.7); }
    .toolbar-spacer { flex: 1; }
    .user-info { margin-right: 16px; font-size: 14px; }
    .content { padding: 24px; }
  `]
})
export class LayoutComponent {
  currentUser;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
