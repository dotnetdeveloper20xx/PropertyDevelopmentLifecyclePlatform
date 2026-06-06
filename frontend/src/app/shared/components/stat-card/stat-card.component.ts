import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable KPI/metric card for dashboards.
 * Presentation component — receives data via @Input, no state management.
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body items-center text-center p-6">
        <p class="text-3xl font-bold text-primary">{{ value }}</p>
        <p class="text-sm text-base-content/60 mt-1">{{ label }}</p>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
}
