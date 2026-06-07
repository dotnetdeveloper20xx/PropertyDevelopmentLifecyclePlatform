/**
 * Planning & Approvals models matching backend DTOs.
 */

export type PlanningApplicationStatus =
  | 'PreApplication'
  | 'Submitted'
  | 'Validated'
  | 'UnderReview'
  | 'CommitteeReview'
  | 'Approved'
  | 'ApprovedWithConditions'
  | 'Refused'
  | 'Appeal'
  | 'Withdrawn';

export type PlanningConditionStatus =
  | 'Pending'
  | 'Submitted'
  | 'Discharged'
  | 'PartiallyDischarged';

export type AppealStatus =
  | 'Submitted'
  | 'InProgress'
  | 'Allowed'
  | 'Dismissed';

export interface PlanningApplicationListItem {
  id: string;
  opportunityId: string;
  applicationReference: string;
  description: string;
  localAuthority: string;
  applicationType: string;
  status: PlanningApplicationStatus;
  submissionDate: string | null;
  decisionDate: string | null;
  conditionCount: number;
  appealCount: number;
  createdAt: string;
}

export interface PlanningApplicationDetail {
  id: string;
  opportunityId: string;
  opportunityName: string;
  applicationReference: string;
  description: string;
  localAuthority: string;
  applicationType: string;
  status: PlanningApplicationStatus;
  submissionDate: string | null;
  validationDate: string | null;
  decisionDate: string | null;
  expiryDate: string | null;
  decisionNotice: string | null;
  planningOfficer: string | null;
  caseOfficerEmail: string | null;
  ward: string | null;
  siteAddress: string | null;
  applicationFee: number | null;
  notes: string | null;
  conditionCount: number;
  appealCount: number;
  documentCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

export interface CreatePlanningApplicationRequest {
  opportunityId: string;
  applicationReference: string;
  description: string;
  localAuthority: string;
  applicationType: string;
  submissionDate?: string;
  planningOfficer?: string;
  caseOfficerEmail?: string;
  ward?: string;
  siteAddress?: string;
  applicationFee?: number;
  notes?: string;
}

export interface UpdatePlanningApplicationRequest {
  id: string;
  applicationReference: string;
  description: string;
  localAuthority: string;
  applicationType: string;
  submissionDate?: string;
  validationDate?: string;
  decisionDate?: string;
  expiryDate?: string;
  decisionNotice?: string;
  planningOfficer?: string;
  caseOfficerEmail?: string;
  ward?: string;
  siteAddress?: string;
  applicationFee?: number;
  notes?: string;
}

export interface PlanningCondition {
  id: string;
  planningApplicationId: string;
  conditionNumber: number;
  title: string;
  description: string;
  status: PlanningConditionStatus;
  dueDate: string | null;
  dischargeDate: string | null;
  dischargeReference: string | null;
  assignedTo: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateConditionRequest {
  title: string;
  description: string;
  dueDate?: string;
  assignedTo?: string;
  notes?: string;
}

export interface DischargeConditionRequest {
  partialDischarge: boolean;
  dischargeReference?: string;
  notes?: string;
}

export interface PlanningAppeal {
  id: string;
  planningApplicationId: string;
  appealReference: string;
  status: AppealStatus;
  appealDate: string;
  hearingDate: string | null;
  decisionDate: string | null;
  inspector: string | null;
  grounds: string | null;
  decision: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateAppealRequest {
  appealReference: string;
  hearingDate?: string;
  inspector?: string;
  grounds: string;
  notes?: string;
}
