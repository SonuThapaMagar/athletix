// types/player/venueBooking.types.ts
export interface Booking {
  id: number;
  venueId: number;
  venueName: string;
  playerId: number;
  playerName: string;
  startTime: string;
  endTime: string;
  amount: number;
  sportType?: string; // 🆕 Which sport they booked
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
  paid: boolean;
  paymentRefId?: string; // 🆕 eSewa transaction reference
  createdAt: string;
}

// Update BookingResponse DTO
export interface BookingResponse extends Booking { }

export interface CreatePendingBookingPayload {
  venueId: number;
  startTime: string;
  durationHours: number;
  sportType?: string;
}