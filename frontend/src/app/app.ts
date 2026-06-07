import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';

/**
 * Root application component.
 * Includes global toast container and confirmation dialog (rendered once, used everywhere).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, ConfirmationDialogComponent],
  template: `
    <router-outlet />
    <app-toast-container />
    <app-confirmation-dialog />
  `
})
export class App {}
