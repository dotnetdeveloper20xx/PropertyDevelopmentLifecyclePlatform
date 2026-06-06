import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Reusable error state with retry action.
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="alert" class="alert alert-error max-w-lg mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 class="font-bold">Error</h3>
        <div class="text-sm">{{ message }}</div>
      </div>
      <button class="btn btn-sm btn-ghost" (click)="retry.emit()" aria-label="Retry">Retry</button>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() message = 'Something went wrong. Please try again.';
  @Output() retry = new EventEmitter<void>();
}
