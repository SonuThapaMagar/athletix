// types/player/venueBooking.types.ts
export interface Booking {
  id: number;
  venueId: number;
  venueName: string;
  venueImage?:string;
  playerId: number;
  playerName: string;
  startTime: string;
  endTime: string;
  amount: number;
  sportType?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
  paid: boolean;
  paymentRefId?: string; 
  createdAt: string;
}

export interface PlayerStats {
  bookingsThisMonth: number;
  activeMatches: number;
  totalHoursPlayed: number;
}

export type PaymentMethod = 'ESEWA' | 'CASH' | 'OTHER';

export interface BookingResponse extends Booking { }

export interface CreatePendingBookingPayload {
  venueId: number;
  startTime: string;
  durationHours: number;
  sportType?: string;
}