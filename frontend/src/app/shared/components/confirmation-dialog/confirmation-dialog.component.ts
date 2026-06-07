import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ConfirmDialogConfig } from '../../../core/services/modal.service';
import { Observable } from 'rxjs';

/**
 * Global confirmation dialog. Place once in app root or layout.
 * Renders when ModalService.confirm() is called.
 */
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dialog$ | async; as config) {
      <div class="modal modal-open" role="dialog" aria-modal="true" [attr.aria-labelledby]="'dialog-title'">
        <div class="modal-box">
          <h3 id="dialog-title" class="text-lg font-bold">{{ config.title }}</h3>
          <p class="py-4 text-base-content/70">{{ config.message }}</p>
          <div class="modal-action">
            <button class="btn btn-ghost" (click)="cancel()" autofocus>
              {{ config.cancelText || 'Cancel' }}
            </button>
            <button class="btn" [class]="getButtonClass(config.type)" (click)="confirm()">
              {{ config.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
        <div class="modal-backdrop" (click)="cancel()"></div>
      </div>
    }
  `
})
export class ConfirmationDialogComponent {
  dialog$: Observable<ConfirmDialogConfig | null>;

  constructor(private modalService: ModalService) {
    this.dialog$ = this.modalService.dialog$;
  }

  getButtonClass(type?: string): string {
    switch (type) {
      case 'danger': return 'btn-error';
      case 'warning': return 'btn-warning';
      default: return 'btn-primary';
    }
  }

  confirm(): void {
    this.modalService.respond(true);
  }

  cancel(): void {
    this.modalService.respond(false);
  }
}
