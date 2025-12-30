import requests from "@/helper/requests";
import { paymentActions } from "@/redux/slices/venueOwner/payment.slice";
import { AppDispatch } from "@/redux/store";
import type { 
  VenueOwnerPayment, 
  PaymentSummary, 
  PaymentFilters,
  PaginationResponse 
} from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

/**
 * Fetch all payments for venue owner (with optional filters)
 */
export const FETCH_VENUE_OWNER_PAYMENTS_ACTION = (filters?: PaymentFilters): Promise<VenueOwnerPayment[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(paymentActions.setLoading(true));

    const params = {
      ...filters,
      page: filters?.page || 1,
      perPage: filters?.perPage || 10,
    };

    requests.venueOwnerPayment
      .getPayments(params)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<VenueOwnerPayment>>>) => {
        // Backend returns: { status: "success", message: "...", data: { data: [], pagination: {} } }
        const paginatedData = res.data.data;
        const payments = paginatedData?.data || [];
        
        AppDispatch(paymentActions.setPayments(payments));
        resolve(payments);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch payments";
        AppDispatch(paymentActions.setError(message));
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
    AppDispatch(paymentActions.setLoading(true));

    requests.venueOwnerPayment
      .getSummary(params)
      .then((res: AxiosResponse<ApiResponse<PaymentSummary>>) => {
        const summary = res.data.data || res.data;
        AppDispatch(paymentActions.setSummary(summary));
        resolve(summary);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch payment summary";
        AppDispatch(paymentActions.setError(message));
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
        // Update payment in list if it exists
        AppDispatch(paymentActions.updatePayment(payment));
        resolve(payment);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch payment";
        AppDispatch(paymentActions.setError(message));
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