import { ReportItem } from '../../../core/models/report.model';

export interface ReportsState {
  reports: ReportItem[];
  loading: boolean;
  totalCount: number;
  error: string | null;
}

export const initialReportsState: ReportsState = {
  reports: [],
  loading: false,
  totalCount: 0,
  error: null
};
