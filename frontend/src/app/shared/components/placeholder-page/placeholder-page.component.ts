import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../page-header/page-header.component';

export interface PlaceholderFeature {
  icon: string;
  title: string;
  description: string;
}

export interface PlaceholderKpi {
  label: string;
  value: string;
  trend?: string;
}

export interface RelatedPage {
  label: string;
  route: string;
}

export type ModuleStatus = 'Implemented' | 'Partial' | 'In Development' | 'Planned';

/**
 * Reusable placeholder page for future modules that haven't been implemented yet.
 * Shows a polished preview of what will be built, with dummy KPIs and feature lists.
 */
@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="breadcrumbs"></app-breadcrumb>
    <app-page-header [title]="pageTitle" [subtitle]="subtitle"></app-page-header>

    <!-- Status Badge -->
    <div class="flex items-center gap-3 mb-6">
      <span class="badge badge-lg" [ngClass]="statusBadgeClass">{{ status }}</span>
      <span class="text-sm text-base-content/50">Module: {{ moduleName }}</span>
    </div>

    <!-- Description Card -->
    <div class="card bg-base-100 border border-base-300 mb-6">
      <div class="card-body">
        <h3 class="card-title text-base">About This Page</h3>
        <p class="text-base-content/70 leading-relaxed">{{ description }}</p>
      </div>
    </div>

    <!-- KPI Preview Cards (if provided) -->
    @if (kpis.length > 0) {
      <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Expected KPIs</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        @for (kpi of kpis; track kpi.label) {
          <div class="card bg-base-100 border border-dashed border-base-300">
            <div class="card-body p-4 items-center text-center">
              <p class="text-2xl font-bold text-base-content/30">{{ kpi.value }}</p>
              <p class="text-xs text-base-content/50">{{ kpi.label }}</p>
              @if (kpi.trend) {
                <p class="text-xs text-base-content/30">{{ kpi.trend }}</p>
              }
            </div>
          </div>
        }
      </div>
    }

    <!-- Expected Features -->
    @if (features.length > 0) {
      <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Planned Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        @for (feature of features; track feature.title) {
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body p-4">
              <div class="flex items-start gap-3">
                <span class="text-xl">{{ feature.icon }}</span>
                <div>
                  <p class="font-medium text-sm">{{ feature.title }}</p>
                  <p class="text-xs text-base-content/60 mt-1">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }

    <!-- Dummy Table Preview -->
    @if (showTablePreview) {
      <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Data Preview</h3>
      <div class="card bg-base-100 border border-dashed border-base-300 mb-6">
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table table-zebra opacity-40">
              <thead>
                <tr>
                  @for (col of tableColumns; track col) {
                    <th>{{ col }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of [1,2,3,4,5]; track row) {
                  <tr>
                    @for (col of tableColumns; track col) {
                      <td><div class="h-4 bg-base-300 rounded w-20"></div></td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }

    <!-- Related Pages -->
    @if (relatedPages.length > 0) {
      <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Related Pages</h3>
      <div class="flex flex-wrap gap-2 mb-6">
        @for (page of relatedPages; track page.route) {
          <a [routerLink]="page.route" class="btn btn-ghost btn-sm">{{ page.label }} →</a>
        }
      </div>
    }

    <!-- Implementation Notice -->
    <div class="card bg-info/5 border border-info/20 mt-6">
      <div class="card-body p-4">
        <div class="flex items-center gap-3">
          <span class="text-info text-xl">🚧</span>
          <div>
            <p class="font-medium text-sm text-info">This area will appear here when implemented</p>
            <p class="text-xs text-base-content/50 mt-1">This page is part of the {{ moduleName }} module which is currently {{ status.toLowerCase() }}. Full functionality will be available in a future release.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Link -->
    <div class="mt-4">
      <a routerLink="/help" class="btn btn-ghost btn-xs">Need help? Visit the Help Centre →</a>
    </div>
  `
})
export class PlaceholderPageComponent {
  @Input() pageTitle = 'Coming Soon';
  @Input() subtitle = '';
  @Input() moduleName = '';
  @Input() status: ModuleStatus = 'Planned';
  @Input() description = '';
  @Input() features: PlaceholderFeature[] = [];
  @Input() kpis: PlaceholderKpi[] = [];
  @Input() relatedPages: RelatedPage[] = [];
  @Input() showTablePreview = false;
  @Input() tableColumns: string[] = ['Name', 'Status', 'Date', 'Assigned To'];
  @Input() breadcrumbs: Array<{label: string; url?: string}> = [];

  get statusBadgeClass(): string {
    switch (this.status) {
      case 'Implemented': return 'badge-success';
      case 'Partial': return 'badge-warning';
      case 'In Development': return 'badge-info';
      case 'Planned': return 'badge-ghost';
      default: return 'badge-ghost';
    }
  }
}
