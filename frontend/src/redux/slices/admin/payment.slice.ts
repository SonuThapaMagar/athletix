import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminPayment, PaymentSummary } from '@/types/admin/payment.types';
import type { Pagination } from '@/types/pagination.types';

export interface IAdminPaymentSlice {
  payments: AdminPayment[];
  summary: PaymentSummary | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAdminPaymentSlice = {
  payments: [],
  summary: null,
  pagination: null,
  loading: false,
  error: null,
};

const adminPaymentSlice = createSlice({
  name: 'adminPayment',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setPayments(state, action: PayloadAction<{ payments: AdminPayment[]; pagination: Pagination }>) {
      state.payments = action.payload.payments;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    setSummary(state, action: PayloadAction<PaymentSummary>) {
      state.summary = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPayment(state, action: PayloadAction<AdminPayment>) {
      state.payments.unshift(action.payload);
    },
    updatePayment(state, action: PayloadAction<AdminPayment>) {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
  },
});

export const { actions: adminPaymentActions, reducer } = adminPaymentSlice;
export default reducer;
