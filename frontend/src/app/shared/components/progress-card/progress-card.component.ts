import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Progress card showing a metric with visual progress bar.
 * Used for pipeline progress, completion tracking, etc.
 */
@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body p-5">
        <div class="flex justify-between items-center">
          <h3 class="text-xs font-medium text-base-content/50 uppercase tracking-wider">{{ label }}</h3>
          <span class="text-sm font-bold">{{ current }}/{{ total }}</span>
        </div>
        <progress
          class="progress w-full mt-2"
          [class]="progressClass"
          [value]="percentage"
          max="100"
          [attr.aria-label]="label + ' progress'"
        ></progress>
        <p class="text-xs text-base-content/40 mt-1">{{ percentage | number:'1.0-0' }}% complete</p>
      </div>
    </div>
  `
})
export class ProgressCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) current!: number;
  @Input({ required: true }) total!: number;
  @Input() color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' = 'primary';

  get percentage(): number {
    return this.total > 0 ? (this.current / this.total) * 100 : 0;
  }

  get progressClass(): string {
    return `progress-${this.color}`;
  }
}
