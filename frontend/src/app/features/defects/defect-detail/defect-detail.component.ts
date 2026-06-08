import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { DefectItem } from '../../../core/models/defect.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-defect-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, BreadcrumbComponent, StatusBadgeComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label:'Home',url:'/dashboard'},{label:'Defects',url:'/defects'},{label:item?.title??'Detail'}]"></app-breadcrumb>
    <app-page-header [title]="item?.title??'Defect Detail'" subtitle="View defect information and resolution status">
      <div class="flex gap-2">
        @if(item){<a [routerLink]="['/defects',itemId,'edit']" class="btn btn-primary btn-sm">Edit</a>}
        <a routerLink="/defects" class="btn btn-ghost btn-sm">← Back</a>
      </div>
    </app-page-header>
    @if(loading){<app-loading-state message="Loading defect..."></app-loading-state>}
    @else if(item){
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-sm"><div class="card-body">
          <h2 class="card-title text-lg">Defect Information</h2><div class="divider mt-0 mb-2"></div>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div><dt class="text-base-content/60 font-medium">Title</dt><dd class="mt-0.5">{{item.title}}</dd></div>
            <div><dt class="text-base-content/60 font-medium">Status</dt><dd class="mt-0.5"><app-status-badge [status]="item.status"></app-status-badge></dd></div>
            <div><dt class="text-base-content/60 font-medium">Priority</dt><dd class="mt-0.5"><span class="badge" [class.badge-error]="item.priority==='Critical'" [class.badge-warning]="item.priority==='High'" [class.badge-info]="item.priority==='Medium'" [class.badge-ghost]="item.priority==='Low'">{{item.priority}}</span></dd></div>
            <div><dt class="text-base-content/60 font-medium">Location</dt><dd class="mt-0.5">{{item.location??'—'}}</dd></div>
            <div><dt class="text-base-content/60 font-medium">Unit Ref</dt><dd class="mt-0.5">{{item.unitReference??'—'}}</dd></div>
            <div><dt class="text-base-content/60 font-medium">Reported By</dt><dd class="mt-0.5">{{item.reportedBy??'—'}}</dd></div>
            <div><dt class="text-base-content/60 font-medium">Assigned To</dt><dd class="mt-0.5">{{item.assignedTo??'—'}}</dd></div>
            <div><dt class="text-base-content/60 font-medium">Reported Date</dt><dd class="mt-0.5">{{item.reportedDate|date:'mediumDate'}}</dd></div>
            <div><dt class="text-base-content/60 font-medium">Resolved Date</dt><dd class="mt-0.5">{{item.resolvedDate?(item.resolvedDate|date:'mediumDate'):'—'}}</dd></div>
          </dl>
        </div></div>
        <div class="card bg-base-100 shadow-sm"><div class="card-body">
          <h2 class="card-title text-lg">Description & Notes</h2><div class="divider mt-0 mb-2"></div>
          <p class="text-sm whitespace-pre-wrap mb-4">{{item.description??'No description provided.'}}</p>
          <h3 class="text-sm font-semibold mt-4">Notes</h3>
          <p class="text-sm whitespace-pre-wrap">{{item.notes??'No notes.'}}</p>
        </div></div>
      </div>
    }
  `
})
export class DefectDetailComponent implements OnInit {
  item: DefectItem | null = null; loading = true; itemId = '';
  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<ApiResponse<DefectItem[]>>(`${environment.apiUrl}/defects`).subscribe({ next: (r) => { this.item = r.data.find(d => d.id === this.itemId) ?? null; this.loading = false; this.cdr.markForCheck(); }, error: () => { this.loading = false; this.cdr.markForCheck(); } });
  }
}
