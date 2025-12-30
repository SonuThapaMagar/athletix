import type { VenueOwnerPayment, PaymentSummary } from '@/types/venueOwner/payment.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IPaymentSlice {
  payments: VenueOwnerPayment[];
  summary: PaymentSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: IPaymentSlice = {
  payments: [],
  summary: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'venueOwnerPayment',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setPayments(state, action: PayloadAction<VenueOwnerPayment[]>) {
      state.payments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPayment(state, action: PayloadAction<VenueOwnerPayment>) {
      state.payments.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    updatePayment(state, action: PayloadAction<VenueOwnerPayment>) {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    setSummary(state, action: PayloadAction<PaymentSummary>) {
      state.summary = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { actions: paymentActions, reducer } = paymentSlice;
export default reducer;
