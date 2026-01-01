export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export type PaymentMethod = 'ESEWA' | 'KHALTI' | 'CASH' | 'OTHER';

export interface AdminPayment {
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
  totalTransactions: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments?: number;
}

export interface PaymentFilters {
  status?: PaymentStatus | 'all';
  venueId?: number;
  startDate?: string;
  endDate?: string;
  paymentMethod?: PaymentMethod;
  search?: string;
  page?: number;
  perPage?: number;
}
