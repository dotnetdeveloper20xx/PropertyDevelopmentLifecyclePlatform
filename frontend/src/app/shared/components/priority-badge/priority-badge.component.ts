import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Priority badge component for task/issue priority display.
 */
@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge badge-sm" [ngClass]="badgeClass">{{ priority }}</span>`
})
export class PriorityBadgeComponent {
  @Input({ required: true }) priority!: string;

  get badgeClass(): string {
    switch (this.priority?.toLowerCase()) {
      case 'urgent': return 'badge-error';
      case 'high': return 'badge-warning';
      case 'medium': return 'badge-info';
      case 'low': return 'badge-ghost';
      default: return 'badge-ghost';
    }
  }
}
