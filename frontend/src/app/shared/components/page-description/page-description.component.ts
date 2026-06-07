import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Page description component. Provides business context and guidance below page headers.
 * Answers: "What is this page? Why does it exist? What can I do here?"
 * 
 * Every major page should include this to make the application self-documenting.
 */
@Component({
  selector: 'app-page-description',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-base-100 border border-base-300 rounded-lg p-4 mb-6">
      <p class="text-sm text-base-content/70 leading-relaxed">{{ description }}</p>
      @if (guidance) {
        <p class="text-sm text-primary/80 mt-2 font-medium">💡 {{ guidance }}</p>
      }
      @if (helpLink) {
        <a [href]="helpLink" class="text-xs text-primary hover:underline mt-2 inline-block">Learn more →</a>
      }
    </div>
  `
})
export class PageDescriptionComponent {
  @Input({ required: true }) description!: string;
  @Input() guidance?: string;
  @Input() helpLink?: string;
}
