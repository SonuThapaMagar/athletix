import requests from "@/helper/requests";
import { adminPaymentActions } from "@/redux/slices/admin/payment.slice";
import { AppDispatch } from "@/redux/store";
import type { AdminPayment, PaymentSummary, PaymentFilters } from "@/types/admin/payment.types";
import type { PaginationResponse } from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_PAYMENTS_ACTION = (filters?: PaymentFilters): Promise<{ payments: AdminPayment[]; pagination: any }> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminPaymentActions.setLoading(true));

    requests.admin.payment
      .getPayments(filters)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<AdminPayment>>>) => {
        const paginatedData = res.data.data || res.data;
        const payments = paginatedData.items || [];
        const pagination = paginatedData.pagination;
        AppDispatch(adminPaymentActions.setPayments({ payments, pagination }));
        resolve({ payments, pagination });
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch payments";
        AppDispatch(adminPaymentActions.setError(message));
        reject(err);
      });
  });

export const FETCH_ADMIN_PAYMENT_SUMMARY_ACTION = (filters?: { startDate?: string; endDate?: string; venueId?: number }): Promise<PaymentSummary> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminPaymentActions.setLoading(true));

    requests.admin.payment
      .getSummary(filters)
      .then((res: AxiosResponse<ApiResponse<PaymentSummary>>) => {
        const summary = res.data.data || res.data;
        AppDispatch(adminPaymentActions.setSummary(summary));
        resolve(summary);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch payment summary";
        AppDispatch(adminPaymentActions.setError(message));
        reject(err);
      });
  });

export const EXPORT_ADMIN_PAYMENTS_ACTION = (filters?: PaymentFilters & { format?: 'csv' | 'excel' }): Promise<Blob> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminPaymentActions.setLoading(true));

    requests.admin.payment
      .exportPayments(filters)
      .then((res: AxiosResponse<Blob>) => {
        AppDispatch(adminPaymentActions.setLoading(false));
        resolve(res.data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to export payments";
        AppDispatch(adminPaymentActions.setError(message));
        reject(err);
      });
  });
