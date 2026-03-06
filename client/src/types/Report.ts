export type IssueType = 'Bug' | 'Feature Request' | 'Improvement' | 'Documentation' | 'Other';

export interface Report {
  id: string;
  issueType: IssueType;
  description: string;
  contactName: string;
  contactEmail: string;
  status: 'NEW' | 'APPROVED' | 'RESOLVED';
  createdAt: number;
  approvedAt?: number;
  attachmentUrl: string;
}

export interface CreateReportPayload {
  issueType: IssueType;
  description: string;
  contactName: string;
  contactEmail: string;
  attachment?: File;
}

export interface ReportFormData {
  issueType: IssueType;
  description: string;
  contactName: string;
  contactEmail: string;
  attachment?: File;
}