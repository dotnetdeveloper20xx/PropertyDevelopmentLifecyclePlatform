import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Reusable loading state component with spinner and optional message.
 */
@Component({
  selector: 'app-loading-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      @if (message) {
        <p class="mt-4 text-base-content/60">{{ message }}</p>
      }
    </div>
  `
})
export class LoadingStateComponent {
  @Input() message = 'Loading...';
}
