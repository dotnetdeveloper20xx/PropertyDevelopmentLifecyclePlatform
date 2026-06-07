import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * Reusable search box with debounced output.
 * Emits search term after 300ms of no typing (prevents excessive API calls).
 */
@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-control">
      <div class="input-group">
        <input
          type="text"
          class="input input-bordered w-full max-w-sm"
          [placeholder]="placeholder"
          [ngModel]="value"
          (ngModelChange)="onInput($event)"
          [attr.aria-label]="placeholder"
        />
        @if (value) {
          <button class="btn btn-ghost btn-sm" (click)="clear()" aria-label="Clear search">✕</button>
        }
      </div>
    </div>
  `
})
export class SearchBoxComponent implements OnDestroy {
  @Input() placeholder = 'Search...';
  @Input() value = '';
  @Input() debounce = 300;
  @Output() searchChanged = new EventEmitter<string>();

  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.inputSubject.pipe(
      debounceTime(this.debounce),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => this.searchChanged.emit(term));
  }

  onInput(value: string): void {
    this.value = value;
    this.inputSubject.next(value);
  }

  clear(): void {
    this.value = '';
    this.searchChanged.emit('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
