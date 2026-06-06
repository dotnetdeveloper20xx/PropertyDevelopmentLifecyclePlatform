import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable status badge with colour-coded variants.
 * Maps domain statuses to DaisyUI badge colours.
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [ngClass]="badgeClass">{{ status }}</span>`
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;

  get badgeClass(): string {
    switch (this.status?.toLowerCase()) {
      case 'identified': return 'badge-info';
      case 'initialreview': return 'badge-warning';
      case 'duediligence': return 'badge-secondary';
      case 'offermade': return 'badge-accent';
      case 'undercontract': return 'badge-primary';
      case 'acquired': return 'badge-success';
      case 'withdrawn': return 'badge-error';
      default: return 'badge-ghost';
    }
  }
}
