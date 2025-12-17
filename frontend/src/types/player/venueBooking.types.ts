export interface Booking {
  id: number;
  venueId: number;
  venueName: string;
  playerId: number;
  playerName: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
  paid: boolean;
  createdAt: string;
}

export interface CreatePendingBookingPayload {
  venueId: number;
  startTime: string; 
  durationHours: number;
}