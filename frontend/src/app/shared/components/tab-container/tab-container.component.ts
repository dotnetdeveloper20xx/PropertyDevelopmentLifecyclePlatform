import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

/**
 * Reusable tab container. Renders tab buttons — content via ng-content.
 * Parent component switches content based on activeTab output.
 */
@Component({
  selector: 'app-tab-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="tablist" class="tabs tabs-bordered mb-6">
      @for (tab of tabs; track tab.id) {
        <button
          role="tab"
          class="tab"
          [class.tab-active]="activeTab === tab.id"
          [disabled]="tab.disabled"
          (click)="selectTab(tab.id)"
          [attr.aria-selected]="activeTab === tab.id"
          [attr.aria-controls]="'panel-' + tab.id"
        >
          {{ tab.label }}
          @if (tab.count !== undefined) {
            <span class="badge badge-sm ml-2">{{ tab.count }}</span>
          }
        </button>
      }
    </div>
    <div [id]="'panel-' + activeTab" role="tabpanel">
      <ng-content></ng-content>
    </div>
  `
})
export class TabContainerComponent {
  @Input({ required: true }) tabs: TabItem[] = [];
  @Input({ required: true }) activeTab!: string;
  @Output() tabChanged = new EventEmitter<string>();

  selectTab(tabId: string): void {
    this.tabChanged.emit(tabId);
  }
}
