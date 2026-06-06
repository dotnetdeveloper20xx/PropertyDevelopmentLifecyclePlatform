import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OpportunityService } from '../../../../core/services/opportunity.service';
import { OpportunityDetail } from '../../../../core/models/opportunity.model';

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatTabsModule,
    MatChipsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    @if (loading) {
      <mat-spinner></mat-spinner>
    } @else if (opportunity) {
      <div class="page-header">
        <div>
          <h1>{{ opportunity.name }}</h1>
          <p class="subtitle">{{ opportunity.location }}</p>
        </div>
        <mat-chip [class]="'status-' + opportunity.status.toLowerCase()">
          {{ opportunity.status }}
        </mat-chip>
      </div>

      <mat-tab-group>
        <mat-tab label="Details">
          <div class="tab-content">
            <div class="detail-grid">
              <mat-card>
                <mat-card-header><mat-card-title>Land Information</mat-card-title></mat-card-header>
                <mat-card-content>
                  <dl>
                    <dt>Size</dt><dd>{{ opportunity.landSize }} {{ opportunity.landSizeUnit }}</dd>
                    <dt>Current Use</dt><dd>{{ opportunity.currentUse || 'N/A' }}</dd>
                    <dt>Title Number</dt><dd>{{ opportunity.titleNumber || 'N/A' }}</dd>
                    <dt>Post Code</dt><dd>{{ opportunity.postCode || 'N/A' }}</dd>
                  </dl>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header><mat-card-title>Financial</mat-card-title></mat-card-header>
                <mat-card-content>
                  <dl>
                    <dt>Asking Price</dt><dd>{{ opportunity.askingPrice | currency:'GBP':'symbol':'1.0-0' }}</dd>
                    <dt>Estimated Value</dt><dd>{{ opportunity.estimatedValue | currency:'GBP':'symbol':'1.0-0' }}</dd>
                    <dt>Dev Cost</dt><dd>{{ opportunity.estimatedDevelopmentCost | currency:'GBP':'symbol':'1.0-0' }}</dd>
                    <dt>ROI</dt><dd>{{ opportunity.roi ? (opportunity.roi + '%') : 'N/A' }}</dd>
                  </dl>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header><mat-card-title>Source</mat-card-title></mat-card-header>
                <mat-card-content>
                  <dl>
                    <dt>Source</dt><dd>{{ opportunity.source || 'N/A' }}</dd>
                    <dt>Agent</dt><dd>{{ opportunity.agentName || 'N/A' }}</dd>
                    <dt>Owner</dt><dd>{{ opportunity.landOwnerName || 'N/A' }}</dd>
                  </dl>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header><mat-card-title>Related</mat-card-title></mat-card-header>
                <mat-card-content>
                  <dl>
                    <dt>Due Diligence Checks</dt><dd>{{ opportunity.dueDiligenceCount }}</dd>
                    <dt>Offers</dt><dd>{{ opportunity.offerCount }}</dd>
                    <dt>Documents</dt><dd>{{ opportunity.documentCount }}</dd>
                  </dl>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Due Diligence ({{ opportunity.dueDiligenceCount }})">
          <div class="tab-content">
            <p>Due diligence checks will be displayed here.</p>
          </div>
        </mat-tab>
        <mat-tab label="Offers ({{ opportunity.offerCount }})">
          <div class="tab-content">
            <p>Offers history will be displayed here.</p>
          </div>
        </mat-tab>
        <mat-tab label="Documents ({{ opportunity.documentCount }})">
          <div class="tab-content">
            <p>Attached documents will be displayed here.</p>
          </div>
        </mat-tab>
      </mat-tab-group>

      <div class="actions">
        <a mat-button routerLink="/opportunities">
          <mat-icon>arrow_back</mat-icon> Back to List
        </a>
      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header h1 { margin: 0; color: #1a237e; }
    .subtitle { color: #666; margin: 4px 0 0; }
    .tab-content { padding: 24px 0; }
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    dl { margin: 0; }
    dt { font-weight: 500; color: #666; font-size: 12px; text-transform: uppercase; margin-top: 12px; }
    dd { margin: 4px 0 0; font-size: 16px; }
    .actions { margin-top: 24px; }
  `]
})
export class OpportunityDetailComponent implements OnInit {
  opportunity: OpportunityDetail | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private opportunityService: OpportunityService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.opportunityService.getById(id).subscribe({
        next: (response) => {
          this.opportunity = response.data;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
  }
}
