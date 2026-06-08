import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-construction-projects',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '/dashboard' },
      { label: 'Design & Construction' },
      { label: 'Projects' }
    ]"></app-breadcrumb>

    <app-page-header title="Construction Projects" subtitle="Manage construction activities across all active development projects">
    </app-page-header>

    <app-page-description
      description="Construction projects represent the building phase of your developments. Each project moves through defined construction stages — from groundworks and foundations through to roofing, fit-out, and final handover. Inspections and snagging are tracked within each stage."
      guidance="Construction is managed at the project level. Use the links below to navigate to your projects or to the construction stages view where you can load stages for a specific project."
      helpLink="/help/construction/stages-overview"
    ></app-page-description>

    <!-- Navigation Card -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <a routerLink="/projects" class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div class="card-body">
          <h3 class="card-title text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            All Projects
          </h3>
          <p class="text-sm text-base-content/60">
            View and manage all development projects. Construction stages, inspections, and snags are managed within individual projects.
          </p>
          <div class="card-actions justify-end mt-2">
            <span class="text-primary text-sm font-medium">Go to Projects →</span>
          </div>
        </div>
      </a>

      <a routerLink="/construction" class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div class="card-body">
          <h3 class="card-title text-base">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Construction Stages
          </h3>
          <p class="text-sm text-base-content/60">
            Load and track construction stages for a specific project. Monitor progress percentages, planned dates, and stage completion.
          </p>
          <div class="card-actions justify-end mt-2">
            <span class="text-secondary text-sm font-medium">Go to Stages →</span>
          </div>
        </div>
      </a>
    </div>

    <!-- Quick Links -->
    <div class="card bg-base-200 border border-base-300 p-5">
      <h3 class="font-semibold text-sm mb-3">Construction Module Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 class="text-xs font-medium uppercase tracking-wider text-base-content/50 mb-2">Stages</h4>
          <p class="text-sm text-base-content/70">Define and track major construction phases such as substructure, superstructure, roofing, and fit-out.</p>
        </div>
        <div>
          <h4 class="text-xs font-medium uppercase tracking-wider text-base-content/50 mb-2">Inspections</h4>
          <p class="text-sm text-base-content/70">Schedule and record inspections for each stage — structural, electrical, plumbing, fire safety, and final handover.</p>
        </div>
        <div>
          <h4 class="text-xs font-medium uppercase tracking-wider text-base-content/50 mb-2">Snagging</h4>
          <p class="text-sm text-base-content/70">Log, assign, and resolve construction defects found during inspections before client handover.</p>
        </div>
      </div>
    </div>
  `
})
export class ConstructionProjectsComponent {}
