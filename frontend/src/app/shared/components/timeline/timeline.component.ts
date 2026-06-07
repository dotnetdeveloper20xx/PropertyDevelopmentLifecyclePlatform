import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineEvent {
  title: string;
  description?: string;
  date: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

/**
 * Timeline component for activity history and audit trails.
 */
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="timeline timeline-vertical timeline-compact">
      @for (event of events; track event.date + event.title) {
        <li>
          <div class="timeline-start text-xs text-base-content/50">{{ event.date | date:'short' }}</div>
          <div class="timeline-middle">
            <div class="w-3 h-3 rounded-full" [ngClass]="getDotClass(event.type)"></div>
          </div>
          <div class="timeline-end timeline-box">
            <p class="font-medium text-sm">{{ event.title }}</p>
            @if (event.description) {
              <p class="text-xs text-base-content/60 mt-1">{{ event.description }}</p>
            }
          </div>
          <hr/>
        </li>
      }
    </ul>
  `
})
export class TimelineComponent {
  @Input({ required: true }) events: TimelineEvent[] = [];

  getDotClass(type?: string): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      case 'info': return 'bg-info';
      default: return 'bg-primary';
    }
  }
}
