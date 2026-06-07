import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceholderPageComponent, PlaceholderFeature, PlaceholderKpi, RelatedPage, ModuleStatus } from '../../shared/components/placeholder-page/placeholder-page.component';
import { FUTURE_PAGES, FuturePageConfig } from './future-pages.data';

/**
 * Generic future page component that renders placeholder content
 * based on the route's data configuration.
 * Each future route passes a 'pageKey' in route data to look up config.
 */
@Component({
  selector: 'app-future-page',
  standalone: true,
  imports: [PlaceholderPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-placeholder-page
      [pageTitle]="config.pageTitle"
      [subtitle]="config.subtitle"
      [moduleName]="config.moduleName"
      [status]="config.status"
      [description]="config.description"
      [features]="config.features"
      [kpis]="config.kpis"
      [relatedPages]="config.relatedPages"
      [showTablePreview]="config.showTablePreview"
      [tableColumns]="config.tableColumns"
      [breadcrumbs]="config.breadcrumbs"
    ></app-placeholder-page>
  `
})
export class FuturePageComponent implements OnInit {
  config: FuturePageConfig = FUTURE_PAGES['default'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const key = this.route.snapshot.data['pageKey'] as string;
    this.config = FUTURE_PAGES[key] ?? FUTURE_PAGES['default'];
  }
}
