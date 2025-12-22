export interface VenueOwnerBooking {
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
