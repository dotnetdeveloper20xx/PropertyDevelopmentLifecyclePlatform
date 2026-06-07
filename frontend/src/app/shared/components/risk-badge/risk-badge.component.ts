import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Risk level badge. Maps risk levels to colour-coded badges.
 */
@Component({
  selector: 'app-risk-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge badge-sm" [ngClass]="badgeClass">{{ level }}</span>`
})
export class RiskBadgeComponent {
  @Input({ required: true }) level!: string;

  get badgeClass(): string {
    switch (this.level?.toLowerCase()) {
      case 'critical': return 'badge-error';
      case 'high': return 'badge-warning';
      case 'medium': return 'badge-info';
      case 'low': return 'badge-success';
      default: return 'badge-ghost';
    }
  }
}
