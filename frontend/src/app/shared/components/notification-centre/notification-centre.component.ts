import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

/**
 * Notification Centre — bell icon dropdown showing recent system notifications.
 * In a future release, this would be powered by a real-time notification service.
 * For now, it shows seeded demo notifications to demonstrate the UX.
 */
@Component({
  selector: 'app-notification-centre',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-sm btn-square relative" aria-label="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 badge badge-xs badge-error">{{ unreadCount() }}</span>
        }
      </label>
      <div tabindex="0" class="dropdown-content z-[100] w-80 mt-3 shadow-lg bg-base-100 border border-base-300 rounded-box">
        <div class="p-3 border-b border-base-200 flex justify-between items-center">
          <h3 class="font-semibold text-sm">Notifications</h3>
          @if (unreadCount() > 0) {
            <button class="btn btn-ghost btn-xs" (click)="markAllRead()">Mark all read</button>
          }
        </div>
        <ul class="max-h-80 overflow-y-auto">
          @for (notification of notifications; track notification.id) {
            <li class="px-3 py-2 hover:bg-base-200 border-b border-base-100 last:border-0 cursor-pointer"
              [class.bg-primary/5]="!notification.read"
              (click)="markRead(notification)">
              <div class="flex items-start gap-2">
                <span class="mt-0.5 text-sm" [ngClass]="{
                  'text-info': notification.type === 'info',
                  'text-success': notification.type === 'success',
                  'text-warning': notification.type === 'warning',
                  'text-error': notification.type === 'error'
                }">
                  @switch (notification.type) {
                    @case ('success') { ✓ }
                    @case ('warning') { ⚠ }
                    @case ('error') { ✕ }
                    @default { ℹ }
                  }
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate" [class.font-bold]="!notification.read">{{ notification.title }}</p>
                  <p class="text-xs text-base-content/60 truncate">{{ notification.message }}</p>
                  <p class="text-xs text-base-content/40 mt-0.5">{{ notification.time }}</p>
                </div>
                @if (!notification.read) {
                  <span class="w-2 h-2 rounded-full bg-primary mt-1.5"></span>
                }
              </div>
            </li>
          }
        </ul>
        <div class="p-2 border-t border-base-200 text-center">
          <a routerLink="/admin/audit" class="btn btn-ghost btn-xs w-full">View All Activity →</a>
        </div>
      </div>
    </div>
  `
})
export class NotificationCentreComponent {
  notifications: Notification[] = [
    { id: '1', title: 'Project milestone completed', message: 'Riverside Apartments: Foundation Complete marked as done', time: '2 hours ago', type: 'success', read: false },
    { id: '2', title: 'New sales lead', message: 'Emma Watson submitted interest in 2-bed apartment', time: '4 hours ago', type: 'info', read: false },
    { id: '3', title: 'Planning condition due soon', message: 'Materials Samples condition due in 30 days', time: '1 day ago', type: 'warning', read: false },
    { id: '4', title: 'Purchase order delivered', message: 'PO/2025/001: Structural steel received on site', time: '2 days ago', type: 'success', read: true },
    { id: '5', title: 'Risk identified', message: 'Labour shortage (electricians) flagged as High probability', time: '3 days ago', type: 'warning', read: true },
    { id: '6', title: 'Contract signed', message: 'Sale & Purchase Agreement completed for Riverside', time: '5 days ago', type: 'success', read: true }
  ];

  unreadCount = signal(this.notifications.filter(n => !n.read).length);

  markRead(notification: Notification): void {
    notification.read = true;
    this.unreadCount.set(this.notifications.filter(n => !n.read).length);
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount.set(0);
  }
}
