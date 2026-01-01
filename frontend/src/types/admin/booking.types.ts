export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';

export interface AdminBooking {
  id: number;
  venueId: number;
  venueName: string;
  playerId: number;
  playerName: string;
  playerEmail: string;
  sport: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  amount: number;
  paid: boolean;
  createdAt: string;
  bookingRefId?: string;
}

export interface BookingFilters {
  status?: BookingStatus | 'all';
  venueId?: number;
  playerId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  perPage?: number;
}
