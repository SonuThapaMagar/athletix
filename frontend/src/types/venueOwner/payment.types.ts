export interface Pagination {
  page: number;
  per_page: number;
  total_record: number;
  total_page: number;
}

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod =  'ESEWA' | 'PAYPAL'  | 'CASH';

export interface VenueOwnerPayment {
  id: number;
  bookingId: number;
  bookingRefId: string;
  venueId: number;
  venueName: string;
  playerId?: number;
  playerName: string;
  playerEmail?: string;
  bookingDate: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  refId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentSummary {
  totalRevenue: number;
  thisMonth: number;
  pending: number;
  totalTransactions: number;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  venueId?: number;
  startDate?: string;
  endDate?: string;
  paymentMethod?: PaymentMethod;
  page?: number;
  perPage?: number;
}

// Your existing pagination response structure
export interface PaginationResponse<T> {
  data: T[];
  pagination: Pagination;
}