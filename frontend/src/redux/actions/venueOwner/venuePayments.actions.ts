// redux/actions/venueOwner/payment.actions.ts
import requests from "@/helper/requests";
import { paymentActions } from "@/redux/slices/venueOwner/payment.slice";
import { AppDispatch } from "@/redux/store";
import type { 
  VenueOwnerPayment, 
  PaymentSummary, 
  PaymentFilters,
  PaginationResponse,
} from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

/**
 * Fetch all payments for venue owner (with optional filters)
 */
export const FETCH_VENUE_OWNER_PAYMENTS_ACTION = (filters?: PaymentFilters): Promise<VenueOwnerPayment[]> =>
  new Promise((resolve, reject) => {
    console.log('🔵 FETCH_VENUE_OWNER_PAYMENTS_ACTION called with filters:', filters);
    AppDispatch(paymentActions.setLoading(true));

    const params = {
      page: filters?.page || 1,
      perPage: filters?.perPage || 10,
      status: filters?.status || 'all',
      ...filters,
    };

    console.log('🔵 Calling API with params:', params);

    requests.venueOwnerPayment
      .getPayments(params)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<VenueOwnerPayment>>>) => {
        console.log('✅ Raw API response:', res.data);

        // Backend returns: 
        // { status: "success", message: "...", data: { items: PaymentResponse[], pagination: Pagination } }
        const paginatedData = res.data.data;
        
        if (!paginatedData) {
          console.error('❌ No data in response');
          AppDispatch(paymentActions.setPayments([]));
          AppDispatch(paymentActions.setLoading(false));
          resolve([]);
          return;
        }

        const payments = paginatedData.items || [];
        console.log('✅ Payments:', payments);
        console.log('✅ Total payments:', payments.length);
        
        AppDispatch(paymentActions.setPayments(payments));
        AppDispatch(paymentActions.setLoading(false));
        resolve(payments);
      })
      .catch((err: any) => {
        console.error('❌ Error fetching payments:', err);
        console.error('❌ Error response:', err.response?.data);
        
        const message = err.response?.data?.message || "Failed to fetch payments";
        AppDispatch(paymentActions.setError(message));
        AppDispatch(paymentActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Fetch payment summary/statistics
 */
export const FETCH_PAYMENT_SUMMARY_ACTION = (params?: {
  startDate?: string;
  endDate?: string;
  venueId?: number;
}): Promise<PaymentSummary> =>
  new Promise((resolve, reject) => {
    console.log('🔵 FETCH_PAYMENT_SUMMARY_ACTION called');
    AppDispatch(paymentActions.setLoading(true));

    requests.venueOwnerPayment
      .getSummary(params)
      .then((res: AxiosResponse<ApiResponse<PaymentSummary>>) => {
        console.log('✅ Payment summary response:', res.data);
        
        const summary = res.data.data || res.data;
        console.log('✅ Extracted summary:', summary);
        
        AppDispatch(paymentActions.setSummary(summary));
        resolve(summary);
      })
      .catch((err: any) => {
        console.error('❌ Error fetching summary:', err);
        
        const message = err.response?.data?.message || "Failed to fetch payment summary";
        AppDispatch(paymentActions.setError(message));
        AppDispatch(paymentActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Fetch single payment by ID
 */
export const FETCH_PAYMENT_BY_ID_ACTION = (paymentId: number): Promise<VenueOwnerPayment> =>
  new Promise((resolve, reject) => {
    AppDispatch(paymentActions.setLoading(true));

    requests.venueOwnerPayment
      .getPaymentById(paymentId)
      .then((res: AxiosResponse<ApiResponse<VenueOwnerPayment>>) => {
        const payment = res.data.data || res.data;
        
        AppDispatch(paymentActions.updatePayment(payment));
        AppDispatch(paymentActions.setLoading(false));
        resolve(payment);
      })
      .catch((err: any) => {
        console.error('❌ Error fetching payment by ID:', err);
        const message = err.response?.data?.message || "Failed to fetch payment";
        AppDispatch(paymentActions.setError(message));
        AppDispatch(paymentActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Export payments to CSV/Excel
 */
export const EXPORT_PAYMENTS_ACTION = (params?: {
  status?: string;
  venueId?: number;
  startDate?: string;
  endDate?: string;
  format?: 'csv' | 'excel';
}): Promise<Blob> =>
  new Promise((resolve, reject) => {
    AppDispatch(paymentActions.setLoading(true));

    requests.venueOwnerPayment
      .exportPayments(params)
      .then((res: AxiosResponse<Blob>) => {
        AppDispatch(paymentActions.setLoading(false));
        resolve(res.data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to export payments";
        AppDispatch(paymentActions.setError(message));
        reject(err);
      });
  });