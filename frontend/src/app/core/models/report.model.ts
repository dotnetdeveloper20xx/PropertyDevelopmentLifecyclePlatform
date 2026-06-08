/**
 * Reports & Dashboards models matching backend DTOs.
 * Module 14 — Executive dashboards, financial/sales/construction reports.
 */

export interface ReportItem {
  id: string;
  title: string;
  description: string | null;
  reportType: string;
  parameters: Record<string, string> | null;
  generatedBy: string | null;
  lastGeneratedAt: string | null;
  createdAt: string;
}

export interface CreateReportRequest {
  title: string;
  description?: string;
  reportType: string;
  parameters?: Record<string, string>;
}
