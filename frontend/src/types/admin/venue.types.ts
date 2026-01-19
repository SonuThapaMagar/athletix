import type { Venue } from '@/types/venue.types/venue.types';

export type VenueStatus = 'ACTIVE' | 'INACTIVE' | 'approved' | 'pending' | 'rejected';

export interface AdminVenue extends Venue {
  status?: VenueStatus;
  owner?: string;
  rating?: number;
}

export interface VenueFilters {
  status?: VenueStatus | 'all';
  search?: string;
  page?: number;
  perPage?: number;
}

