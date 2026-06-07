/**
 * Legal & Compliance models matching backend DTOs.
 */

export type ContractType = 'SaleAndPurchase' | 'OptionAgreement' | 'ConditionalContract' | 'Lease' | 'JointVenture' | 'Consultancy';
export type ContractStatus = 'Draft' | 'UnderReview' | 'AwaitingSignature' | 'Exchanged' | 'Completed' | 'Terminated' | 'Expired';
export type ComplianceCheckType = 'AML' | 'KYC' | 'TitleVerification' | 'LocalAuthority' | 'Environmental' | 'Planning' | 'Utilities' | 'Drainage' | 'HighwaySearch' | 'Mining';
export type ComplianceCheckStatus = 'NotStarted' | 'InProgress' | 'Passed' | 'Failed' | 'Flagged' | 'Expired';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type LegalTaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type LegalTaskStatus = 'Open' | 'InProgress' | 'Completed' | 'Cancelled';

export interface ContractListItem {
  id: string;
  opportunityId: string;
  title: string;
  contractType: ContractType;
  status: ContractStatus;
  contractReference: string;
  counterpartyName: string;
  contractValue: number | null;
  currency: string;
  exchangeDate: string | null;
  completionDate: string | null;
  documentCount: number;
  taskCount: number;
  createdAt: string;
}

export interface ContractDetail {
  id: string;
  opportunityId: string;
  opportunityName: string;
  title: string;
  contractType: ContractType;
  status: ContractStatus;
  contractReference: string;
  counterpartyName: string;
  counterpartyContact: string | null;
  contractValue: number | null;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  exchangeDate: string | null;
  completionDate: string | null;
  solicitor: string | null;
  solicitorFirm: string | null;
  solicitorEmail: string | null;
  keyTerms: string | null;
  notes: string | null;
  documentCount: number;
  taskCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

export interface CreateContractRequest {
  opportunityId: string;
  title: string;
  contractType: ContractType;
  contractReference: string;
  counterpartyName: string;
  counterpartyContact?: string;
  contractValue?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  solicitor?: string;
  solicitorFirm?: string;
  solicitorEmail?: string;
  keyTerms?: string;
  notes?: string;
}

export interface ComplianceCheckItem {
  id: string;
  opportunityId: string;
  checkType: ComplianceCheckType;
  status: ComplianceCheckStatus;
  assignedTo: string | null;
  dueDate: string | null;
  completedDate: string | null;
  outcome: string | null;
  riskLevel: RiskLevel | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateComplianceCheckRequest {
  checkType: ComplianceCheckType;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
}

export interface LegalTaskItem {
  id: string;
  contractId: string | null;
  opportunityId: string | null;
  title: string;
  description: string | null;
  priority: LegalTaskPriority;
  status: LegalTaskStatus;
  assignedTo: string | null;
  dueDate: string | null;
  completedDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateLegalTaskRequest {
  contractId?: string;
  opportunityId?: string;
  title: string;
  description?: string;
  priority: LegalTaskPriority;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
}
