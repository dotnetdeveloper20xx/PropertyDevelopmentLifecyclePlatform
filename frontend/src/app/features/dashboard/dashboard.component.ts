import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OpportunityService } from '../../core/services/opportunity.service';
import { OpportunityStats } from '../../core/models/opportunity.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <h1>Land Acquisition Dashboard</h1>

    @if (loading) {
      <mat-spinner></mat-spinner>
    } @else if (stats) {
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ stats.totalOpportunities }}</div>
            <div class="stat-label">Total Opportunities</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ stats.totalPipelineValue | currency:'GBP':'symbol':'1.0-0' }}</div>
            <div class="stat-label">Pipeline Value</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ stats.identified }}</div>
            <div class="stat-label">Identified</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ stats.dueDiligence }}</div>
            <div class="stat-label">Due Diligence</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ stats.offerMade }}</div>
            <div class="stat-label">Offer Made</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ stats.acquired }}</div>
            <div class="stat-label">Acquired</div>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    h1 { margin-bottom: 24px; color: #1a237e; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .stat-card { text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #1a237e; }
    .stat-label { font-size: 14px; color: #666; margin-top: 8px; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: OpportunityStats | null = null;
  loading = true;

  constructor(private opportunityService: OpportunityService) {}

  ngOnInit(): void {
    this.opportunityService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
