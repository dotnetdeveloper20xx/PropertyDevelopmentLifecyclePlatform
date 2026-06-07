import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Section wrapper for content grouping with optional title and description.
 */
@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mb-8" [attr.aria-labelledby]="title ? 'section-' + title.replace(' ', '-') : null">
      @if (title) {
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-base-content" [id]="'section-' + title.replace(' ', '-')">{{ title }}</h2>
          @if (description) {
            <p class="text-sm text-base-content/60 mt-1">{{ description }}</p>
          }
        </div>
      }
      <ng-content></ng-content>
    </section>
  `
})
export class SectionComponent {
  @Input() title?: string;
  @Input() description?: string;
}
