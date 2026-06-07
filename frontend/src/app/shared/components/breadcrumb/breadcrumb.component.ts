import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

/**
 * Breadcrumb navigation component.
 * Shows the user where they are in the application hierarchy.
 * Answers: "Where am I? Where did I come from?"
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb" class="text-sm breadcrumbs mb-4">
      <ul>
        @for (item of items; track item.label; let last = $last) {
          <li>
            @if (item.url && !last) {
              <a [routerLink]="item.url" class="text-base-content/60 hover:text-primary">{{ item.label }}</a>
            } @else {
              <span class="text-base-content font-medium">{{ item.label }}</span>
            }
          </li>
        }
      </ul>
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input({ required: true }) items: BreadcrumbItem[] = [];
}
