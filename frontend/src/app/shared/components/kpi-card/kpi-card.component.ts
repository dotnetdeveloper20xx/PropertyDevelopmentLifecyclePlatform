import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * KPI card for dashboards. Shows value with trend indicator and comparison.
 * Presentation component — zero logic.
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body p-5">
        <h3 class="text-xs font-medium text-base-content/50 uppercase tracking-wider">{{ label }}</h3>
        <p class="text-2xl font-bold mt-1" [class]="valueClass">{{ formattedValue }}</p>
        @if (trend !== undefined) {
          <div class="flex items-center gap-1 mt-2 text-xs">
            <span [class]="trend >= 0 ? 'text-success' : 'text-error'">
              {{ trend >= 0 ? '↑' : '↓' }} {{ trend | number:'1.1-1' }}%
            </span>
            <span class="text-base-content/40">vs last period</span>
          </div>
        }
        @if (subtitle) {
          <p class="text-xs text-base-content/40 mt-1">{{ subtitle }}</p>
        }
      </div>
    </div>
  `
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() trend?: number;
  @Input() subtitle?: string;
  @Input() prefix?: string;
  @Input() valueColor: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'default' = 'default';

  get formattedValue(): string {
    return this.prefix ? `${this.prefix}${this.value}` : String(this.value);
  }

  get valueClass(): string {
    if (this.valueColor === 'default') return 'text-base-content';
    return `text-${this.valueColor}`;
  }
}
