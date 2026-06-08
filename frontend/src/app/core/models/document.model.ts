/**
 * Documents & Knowledge models matching backend DTOs.
 * Module 13 — Document repository, version control, templates.
 */

export type DocumentCategory =
  | 'Contract'
  | 'Planning'
  | 'Legal'
  | 'Financial'
  | 'Construction'
  | 'Sales'
  | 'Compliance'
  | 'Template'
  | 'Report'
  | 'Other';

export interface DocumentItem {
  id: string;
  projectId: string | null;
  title: string;
  description: string | null;
  category: DocumentCategory;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  version: number;
  tags: string[] | null;
  uploadedBy: string | null;
  uploadedAt: string;
  createdAt: string;
}

export interface CreateDocumentRequest {
  projectId?: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  tags?: string[];
}
