export interface Report {
  id: string;
  issueType: string;
  description: string;
  contactName: string;
  contactEmail: string;
  status: 'NEW' | 'APPROVED' | 'RESOLVED';
  createdAt: number;
  approvedAt?: number;
  attachmentUrl: string;
}

export interface UserStatusEntry {
  email: string;
  status: 'allowed' | 'blacklisted' | 'admin';
  reason?: string;
}
export type UserStatus = 'allowed' | 'blacklisted' | 'admin';

export interface UserStatusResponse {
  status: UserStatus;
  reason?: string;
}

export type ReportCreateResponse = Pick<Report, 'id' | 'status' | 'createdAt' | 'approvedAt'>;
