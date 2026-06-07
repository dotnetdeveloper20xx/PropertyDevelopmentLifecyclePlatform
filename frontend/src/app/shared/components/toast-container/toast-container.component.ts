import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { Observable } from 'rxjs';

/**
 * Global toast notification container. Place once in app root or layout.
 * Renders all active toasts from ToastService.
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast toast-end toast-top z-50" aria-live="polite">
      @for (toast of toasts$ | async; track toast.id) {
        <div class="alert" [class]="getAlertClass(toast.type)" role="alert">
          <span>{{ toast.message }}</span>
          <button class="btn btn-ghost btn-xs" (click)="dismiss(toast.id)" aria-label="Dismiss">✕</button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  getAlertClass(type: string): string {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return '';
    }
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
