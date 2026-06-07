import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Reusable form field wrapper. Provides consistent label, error message, hint, and contextual help tooltip.
 * Wraps any form input control via ng-content projection.
 *
 * The optional `helpTooltip` provides inline "?" icon with hover/click help text.
 * The optional `helpLink` navigates to a relevant Help Centre article.
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-control w-full">
      @if (label) {
        <label class="label" [attr.for]="fieldId">
          <span class="label-text flex items-center gap-1.5">
            {{ label }}
            @if (required) { <span class="text-error">*</span> }
            @if (helpTooltip) {
              <span class="tooltip tooltip-right cursor-help" [attr.data-tip]="helpTooltip">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/40 hover:text-primary transition-colors"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
            }
          </span>
          @if (helpLink) {
            <a [routerLink]="helpLink" class="label-text-alt text-primary hover:underline text-xs" tabindex="-1">Help →</a>
          }
        </label>
      }
      <ng-content></ng-content>
      @if (error) {
        <label class="label" [attr.aria-live]="'polite'">
          <span class="label-text-alt text-error">{{ error }}</span>
        </label>
      }
      @if (hint && !error) {
        <label class="label">
          <span class="label-text-alt text-base-content/50">{{ hint }}</span>
        </label>
      }
    </div>
  `
})
export class FormFieldComponent {
  @Input() label?: string;
  @Input() fieldId?: string;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() required = false;
  /** Inline tooltip text shown on hover/focus of the "?" icon */
  @Input() helpTooltip?: string;
  /** Route to a Help Centre article for detailed guidance */
  @Input() helpLink?: string;
}
