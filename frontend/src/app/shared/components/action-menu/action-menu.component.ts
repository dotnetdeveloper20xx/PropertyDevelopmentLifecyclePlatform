import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActionMenuItem {
  label: string;
  icon?: string;
  action: string;
  danger?: boolean;
  disabled?: boolean;
}

/**
 * Dropdown action menu for row-level actions in tables and cards.
 */
@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-square" aria-label="Actions">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/>
        </svg>
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-50 w-48 p-2 shadow border border-base-300">
        @for (item of items; track item.action) {
          <li [class.disabled]="item.disabled">
            <button
              (click)="onAction(item)"
              [disabled]="item.disabled"
              [class.text-error]="item.danger"
              class="text-sm"
            >
              {{ item.label }}
            </button>
          </li>
        }
      </ul>
    </div>
  `
})
export class ActionMenuComponent {
  @Input({ required: true }) items: ActionMenuItem[] = [];
  @Output() actionSelected = new EventEmitter<string>();

  onAction(item: ActionMenuItem): void {
    if (!item.disabled) {
      this.actionSelected.emit(item.action);
    }
  }
}
