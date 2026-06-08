import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ActivityEntry {
  id: string;
  action: 'Create' | 'Update' | 'Delete';
  entityName: string;
  entityId: string;
  userName: string;
  timestamp: string;
  module: string;
  affectedColumns: string[] | null;
}

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="card-body">
        <!-- Header -->
        <h3 class="card-title text-base">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ title }}
        </h3>

        <!-- Loading State -->
        @if (loading) {
          <div class="flex flex-col items-center justify-center py-8">
            <span class="loading loading-spinner loading-md text-primary"></span>
            <p class="mt-3 text-sm text-base-content/60">Loading activity...</p>
          </div>
        }

        <!-- Empty State -->
        @if (!loading && entries.length === 0) {
          <div class="flex flex-col items-center justify-center py-8 text-center">
            <div class="text-3xl mb-2">📋</div>
            <p class="text-sm text-base-content/60">No recent activity to display.</p>
            <p class="text-xs text-base-content/40 mt-1">Activity will appear here as changes are made.</p>
          </div>
        }

        <!-- Timeline -->
        @if (!loading && entries.length > 0) {
          <div class="relative mt-2">
            <!-- Vertical line -->
            <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-base-300" aria-hidden="true"></div>

            <ul class="space-y-4" role="list" aria-label="Activity timeline">
              @for (entry of entries; track entry.id) {
                <li class="relative pl-8">
                  <!-- Timeline dot -->
                  <div
                    class="absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-base-100"
                    [ngClass]="getDotClass(entry.action)"
                    aria-hidden="true"
                  ></div>

                  <!-- Entry content -->
                  <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="badge badge-xs" [ngClass]="getActionBadgeClass(entry.action)">
                        {{ entry.action }}
                      </span>
                      <span class="text-sm">
                        <span class="font-medium">{{ entry.userName }}</span>
                        <span class="text-base-content/60">
                          {{ getActionVerb(entry.action) }}
                        </span>
                        <span class="font-medium">{{ entry.entityName }}</span>
                      </span>
                    </div>

                    <!-- Affected columns (for updates) -->
                    @if (entry.action === 'Update' && entry.affectedColumns && entry.affectedColumns.length > 0) {
                      <div class="flex flex-wrap gap-1 mt-0.5">
                        @for (col of entry.affectedColumns; track col) {
                          <span class="badge badge-xs badge-ghost">{{ col }}</span>
                        }
                      </div>
                    }

                    <!-- Timestamp -->
                    <span class="text-xs text-base-content/40">{{ formatRelativeTime(entry.timestamp) }}</span>
                  </div>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `
})
export class ActivityFeedComponent implements OnInit {
  @Input() module = '';
  @Input() entityId = '';
  @Input() limit = 10;
  @Input() title = 'Recent Activity';

  entries: ActivityEntry[] = [];
  loading = true;

  private readonly baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadActivity();
  }

  formatRelativeTime(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'Create': return 'badge-success';
      case 'Update': return 'badge-warning';
      case 'Delete': return 'badge-error';
      default: return 'badge-ghost';
    }
  }

  getDotClass(action: string): string {
    switch (action) {
      case 'Create': return 'bg-success';
      case 'Update': return 'bg-warning';
      case 'Delete': return 'bg-error';
      default: return 'bg-base-300';
    }
  }

  getActionVerb(action: string): string {
    switch (action) {
      case 'Create': return ' created ';
      case 'Update': return ' updated ';
      case 'Delete': return ' deleted ';
      default: return ' modified ';
    }
  }

  private loadActivity(): void {
    this.loading = true;

    let url = `${this.baseUrl}/activity?limit=${this.limit}`;
    if (this.module) {
      url += `&module=${encodeURIComponent(this.module)}`;
    }
    if (this.entityId) {
      url += `&entityId=${encodeURIComponent(this.entityId)}`;
    }

    this.http.get<ActivityEntry[]>(url).subscribe({
      next: (entries) => {
        this.entries = entries;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.entries = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
