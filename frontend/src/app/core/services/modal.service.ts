import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

/**
 * Modal/Dialog service. Provides programmatic confirmation dialogs.
 * Components subscribe to dialog$ and render the ConfirmationDialog.
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialogSubject = new BehaviorSubject<ConfirmDialogConfig | null>(null);
  private responseSubject = new Subject<boolean>();

  dialog$ = this.dialogSubject.asObservable();

  confirm(config: ConfirmDialogConfig): Observable<boolean> {
    this.dialogSubject.next(config);
    return this.responseSubject.asObservable().pipe(take(1));
  }

  respond(confirmed: boolean): void {
    this.responseSubject.next(confirmed);
    this.dialogSubject.next(null);
  }

  close(): void {
    this.respond(false);
  }
}
