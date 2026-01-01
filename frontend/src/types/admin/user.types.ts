export type UserRole = 'PLAYER' | 'VENUE_OWNER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'INACTIVE';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
}

export interface UserFilters {
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  search?: string;
  page?: number;
  perPage?: number;
}
