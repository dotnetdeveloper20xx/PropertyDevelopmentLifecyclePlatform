import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OpportunityService } from '../../../../core/services/opportunity.service';
import { OpportunityListItem } from '../../../../core/models/opportunity.model';
import { PaginationMeta } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatTableModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatCardModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-header">
      <h1>Land Opportunities</h1>
      <a mat-raised-button color="primary" routerLink="/opportunities/new">
        <mat-icon>add</mat-icon> New Opportunity
      </a>
    </div>

    @if (loading) {
      <mat-spinner></mat-spinner>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="opportunities" class="full-width">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row">
              <a [routerLink]="['/opportunities', row.id]">{{ row.name }}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let row">{{ row.location }}</td>
          </ng-container>

          <ng-container matColumnDef="landSize">
            <th mat-header-cell *matHeaderCellDef>Size</th>
            <td mat-cell *matCellDef="let row">{{ row.landSize }} {{ row.landSizeUnit }}</td>
          </ng-container>

          <ng-container matColumnDef="askingPrice">
            <th mat-header-cell *matHeaderCellDef>Asking Price</th>
            <td mat-cell *matCellDef="let row">
              {{ row.askingPrice | currency:'GBP':'symbol':'1.0-0' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip [class]="'status-' + row.status.toLowerCase()">{{ row.status }}</mat-chip>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>

      @if (pagination) {
        <p class="pagination-info">
          Showing {{ opportunities.length }} of {{ pagination.totalCount }} opportunities
          (Page {{ pagination.page }} of {{ pagination.totalPages }})
        </p>
      }
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { color: #1a237e; margin: 0; }
    .full-width { width: 100%; }
    a { text-decoration: none; color: #1a237e; font-weight: 500; }
    .pagination-info { margin-top: 16px; color: #666; text-align: center; }
  `]
})
export class OpportunityListComponent implements OnInit {
  opportunities: OpportunityListItem[] = [];
  pagination: PaginationMeta | null = null;
  loading = true;
  displayedColumns = ['name', 'location', 'landSize', 'askingPrice', 'status'];

  constructor(private opportunityService: OpportunityService) {}

  ngOnInit(): void {
    this.loadOpportunities();
  }

  private loadOpportunities(): void {
    this.opportunityService.getAll({ page: 1, pageSize: 50 }).subscribe({
      next: (response) => {
        this.opportunities = response.data;
        this.pagination = response.pagination ?? null;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
