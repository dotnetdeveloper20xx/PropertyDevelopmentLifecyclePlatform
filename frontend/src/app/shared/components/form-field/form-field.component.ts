import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable form field wrapper. Provides consistent label, error message, and layout.
 * Wraps any form input control via ng-content projection.
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-control w-full">
      @if (label) {
        <label class="label" [attr.for]="fieldId">
          <span class="label-text">
            {{ label }}
            @if (required) { <span class="text-error">*</span> }
          </span>
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
}
