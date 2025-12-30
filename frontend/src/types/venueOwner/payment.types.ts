import type { Pagination } from "../pagination.types";

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod =  'ESEWA' | 'PAYPAL'  | 'CASH';

export interface VenueOwnerPayment {
  id: number;
  bookingId: number;
  bookingRefId: string;
  venueId: number;
  venueName: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  refId?: string;
  createdAt: string;
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

// Pagination response structure (matches backend DTO)
export interface PaginationResponse<T> {
  items: T[];
  pagination: Pagination;
}