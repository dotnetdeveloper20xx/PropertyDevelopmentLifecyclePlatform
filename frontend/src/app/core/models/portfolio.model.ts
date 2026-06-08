export type PortfolioStatus = 'Draft' | 'Active' | 'UnderReview' | 'Completed' | 'Archived';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface PortfolioItem {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  targetUnits: number;
  targetInvestment: number;
  targetProfit: number;
  riskLevel: RiskLevel;
  status: PortfolioStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  region?: string;
  targetUnits: number;
  targetInvestment: number;
  targetProfit: number;
  riskLevel: RiskLevel;
  notes?: string;
}
