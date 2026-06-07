import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationMeta } from '../../../core/models/api-response.model';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../error-state/error-state.component';

export interface DataGridColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface DataGridSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface DataGridPageEvent {
  page: number;
  pageSize: number;
}

/**
 * Enterprise Data Grid component.
 * Supports: search, sort, pagination, loading/empty/error states, row click.
 * Presentation component — receives data via @Input, emits events via @Output.
 */
@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyStateComponent, SkeletonLoaderComponent, ErrorStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Search Bar -->
    @if (searchable) {
      <div class="mb-4">
        <input
          type="text"
          class="input input-bordered w-full max-w-sm"
          placeholder="Search..."
          [ngModel]="searchTerm"
          (ngModelChange)="onSearch($event)"
          aria-label="Search"
        />
      </div>
    }

    <!-- Grid Content -->
    @if (loading) {
      <app-skeleton-loader variant="table" [count]="5"></app-skeleton-loader>
    } @else if (error) {
      <app-error-state [message]="error" (retry)="retryClicked.emit()"></app-error-state>
    } @else if (!data || data.length === 0) {
      <app-empty-state [title]="emptyTitle" [message]="emptyMessage">
        <ng-content select="[emptyAction]"></ng-content>
      </app-empty-state>
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" [attr.aria-label]="ariaLabel">
            <thead>
              <tr>
                @for (col of columns; track col.key) {
                  <th
                    [style.width]="col.width"
                    [class.cursor-pointer]="col.sortable"
                    (click)="col.sortable ? onSort(col.key) : null"
                    [attr.aria-sort]="getSortAria(col.key)"
                  >
                    {{ col.label }}
                    @if (col.sortable && currentSort?.column === col.key) {
                      <span class="ml-1">{{ currentSort!.direction === 'asc' ? '↑' : '↓' }}</span>
                    }
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of data; track trackByFn(row)) {
                <tr
                  class="hover cursor-pointer"
                  (click)="rowClicked.emit(row)"
                  [attr.tabindex]="0"
                  (keydown.enter)="rowClicked.emit(row)"
                >
                  @for (col of columns; track col.key) {
                    <td>{{ row[col.key] }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      @if (pagination) {
        <div class="flex justify-between items-center mt-4 text-sm text-base-content/60">
          <span>{{ pagination.totalCount }} total items</span>
          <div class="join">
            <button
              class="join-item btn btn-sm"
              [disabled]="!pagination.hasPreviousPage"
              (click)="onPageChange(pagination.page - 1)"
              aria-label="Previous page"
            >«</button>
            <button class="join-item btn btn-sm btn-active">Page {{ pagination.page }}</button>
            <button
              class="join-item btn btn-sm"
              [disabled]="!pagination.hasNextPage"
              (click)="onPageChange(pagination.page + 1)"
              aria-label="Next page"
            >»</button>
          </div>
        </div>
      }
    }
  `
})
export class DataGridComponent {
  @Input({ required: true }) columns: DataGridColumn[] = [];
  @Input() data: Record<string, unknown>[] | null = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() pagination: PaginationMeta | null = null;
  @Input() searchable = true;
  @Input() searchTerm = '';
  @Input() currentSort: DataGridSort | null = null;
  @Input() ariaLabel = 'Data grid';
  @Input() emptyTitle = 'No data found';
  @Input() emptyMessage = 'There are no items to display.';
  @Input() trackByKey = 'id';

  @Output() searchChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<DataGridSort>();
  @Output() pageChanged = new EventEmitter<DataGridPageEvent>();
  @Output() rowClicked = new EventEmitter<Record<string, unknown>>();
  @Output() retryClicked = new EventEmitter<void>();

  trackByFn(row: Record<string, unknown>): unknown {
    return row[this.trackByKey];
  }

  onSearch(term: string): void {
    this.searchChanged.emit(term);
  }

  onSort(column: string): void {
    const direction: 'asc' | 'desc' =
      this.currentSort?.column === column && this.currentSort.direction === 'asc'
        ? 'desc' : 'asc';
    this.sortChanged.emit({ column, direction });
  }

  onPageChange(page: number): void {
    if (this.pagination) {
      this.pageChanged.emit({ page, pageSize: this.pagination.pageSize });
    }
  }

  getSortAria(column: string): string | null {
    if (this.currentSort?.column !== column) return null;
    return this.currentSort.direction === 'asc' ? 'ascending' : 'descending';
  }
}
