import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable skeleton loader. Shows animated placeholder shapes while content loads.
 * Preferred over spinners for content areas (better perceived performance).
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-pulse space-y-4" [attr.aria-label]="'Loading content'" role="status">
      @switch (variant) {
        @case ('card') {
          <div class="h-32 bg-base-300 rounded-lg"></div>
        }
        @case ('table') {
          @for (row of rows; track row) {
            <div class="flex gap-4">
              <div class="h-4 bg-base-300 rounded flex-1"></div>
              <div class="h-4 bg-base-300 rounded w-24"></div>
              <div class="h-4 bg-base-300 rounded w-32"></div>
              <div class="h-4 bg-base-300 rounded w-20"></div>
            </div>
          }
        }
        @case ('text') {
          <div class="h-4 bg-base-300 rounded w-3/4"></div>
          <div class="h-4 bg-base-300 rounded w-1/2"></div>
          <div class="h-4 bg-base-300 rounded w-2/3"></div>
        }
        @case ('stats') {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="h-24 bg-base-300 rounded-lg"></div>
            }
          </div>
        }
        @default {
          <div class="h-4 bg-base-300 rounded w-full"></div>
          <div class="h-4 bg-base-300 rounded w-3/4"></div>
        }
      }
    </div>
  `
})
export class SkeletonLoaderComponent {
  @Input() variant: 'card' | 'table' | 'text' | 'stats' | 'default' = 'default';
  @Input() count = 5;

  get rows(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
