import venueSlice, { type IVenuesSlice } from "@/redux/slices/venues/venueSlice";
import authSlice, { type IAuthSlice } from "./authSlice";
import playerVenueSlice, { type IPlayerVenuesSlice } from "./player/playerVenue.slice";
import venueBookingSlice, { type IVenueBookingSlice } from "./player/venueBooking.slice";
import venueOwnerBookingSlice, { type IVenueOwnerBookingSlice } from "./venueOwner/venueOwnerBooking.slice";
import scheduleSlice, { type IScheduleSlice } from "./venueOwner/schedule.slice";
import paymentSlice, { type IPaymentSlice } from "./venueOwner/payment.slice";
import dashboardSlice, { type IDashboardSlice } from "./venueOwner/dashboard.slice";
import analyticsSlice, { type IAnalyticsSlice } from "./venueOwner/analytics.slice";

export interface StateType {
  venueSlice: IVenuesSlice;
  authSlice: IAuthSlice;
  playerVenueSlice: IPlayerVenuesSlice;
  venueBookingSlice: IVenueBookingSlice;
  venueOwnerBookingSlice: IVenueOwnerBookingSlice;
  scheduleSlice: IScheduleSlice;
  paymentSlice: IPaymentSlice;
  dashboardSlice: IDashboardSlice;
  analyticsSlice: IAnalyticsSlice;
}

const reducers = {
  venueSlice,
  authSlice,
  playerVenueSlice,
  venueBookingSlice,
  venueOwnerBookingSlice,
  scheduleSlice,
  paymentSlice,
  dashboardSlice,
  analyticsSlice,
};

export default reducers;
