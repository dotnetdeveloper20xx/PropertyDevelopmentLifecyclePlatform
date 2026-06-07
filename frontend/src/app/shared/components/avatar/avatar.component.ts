import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Avatar component showing user initials or image.
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="avatar placeholder">
      <div class="rounded-full bg-neutral text-neutral-content" [ngClass]="sizeClass">
        @if (imageUrl) {
          <img [src]="imageUrl" [alt]="name" />
        } @else {
          <span [class]="textSizeClass">{{ initials }}</span>
        }
      </div>
    </div>
  `
})
export class AvatarComponent {
  @Input({ required: true }) name!: string;
  @Input() imageUrl?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get initials(): string {
    return this.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  get sizeClass(): string {
    switch (this.size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-14 h-14';
      default: return 'w-10 h-10';
    }
  }

  get textSizeClass(): string {
    switch (this.size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-lg';
      default: return 'text-sm';
    }
  }
}
