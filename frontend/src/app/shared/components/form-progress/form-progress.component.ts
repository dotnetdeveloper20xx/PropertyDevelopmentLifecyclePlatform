import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FormStep {
  label: string;
  completed: boolean;
  active: boolean;
}

/**
 * Multi-step form progress indicator.
 * Shows the user where they are in a multi-section form.
 * Used in complex forms (e.g., opportunity creation with sections).
 */
@Component({
  selector: 'app-form-progress',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Form progress" class="mb-6">
      <ul class="steps steps-horizontal w-full">
        @for (step of steps; track step.label; let i = $index) {
          <li class="step"
            [class.step-primary]="step.completed || step.active"
            [attr.aria-current]="step.active ? 'step' : null">
            <span class="text-xs" [class.font-medium]="step.active">{{ step.label }}</span>
          </li>
        }
      </ul>
    </nav>
  `
})
export class FormProgressComponent {
  @Input({ required: true }) steps: FormStep[] = [];
}
