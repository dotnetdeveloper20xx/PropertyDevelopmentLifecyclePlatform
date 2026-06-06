import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Reusable empty state for when no data is available.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="text-5xl mb-4">📭</div>
      <h3 class="text-lg font-semibold text-base-content">{{ title }}</h3>
      <p class="text-sm text-base-content/60 mt-2 max-w-md">{{ message }}</p>
      <div class="mt-6">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = 'No data found';
  @Input() message = 'There are no items to display.';
}
