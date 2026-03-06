type UserStatus = 'allowed' | 'blacklisted' | 'admin';

export interface UserCheckStatusResponse {
  status: UserStatus;
  reason?: string;
}