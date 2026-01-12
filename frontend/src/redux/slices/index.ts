import venueSlice, { type IVenuesSlice } from "@/redux/slices/venues/venueSlice";
import authSlice, { type IAuthSlice } from "./authSlice";
import playerVenueSlice, { type IPlayerVenuesSlice } from "./player/playerVenue.slice";
import venueBookingSlice, { type IVenueBookingSlice } from "./player/venueBooking.slice";
import venueOwnerBookingSlice, { type IVenueOwnerBookingSlice } from "./venueOwner/venueOwnerBooking.slice";
import scheduleSlice, { type IScheduleSlice } from "./venueOwner/schedule.slice";
import paymentSlice, { type IPaymentSlice } from "./venueOwner/payment.slice";
import dashboardSlice, { type IDashboardSlice } from "./venueOwner/dashboard.slice";
import analyticsSlice, { type IAnalyticsSlice } from "./venueOwner/analytics.slice";
import adminDashboardSlice, { type IAdminDashboardSlice } from "./admin/dashboard.slice";
import adminUserSlice, { type IAdminUserSlice } from "./admin/user.slice";
import adminBookingSlice, { type IAdminBookingSlice } from "./admin/booking.slice";
import adminPaymentSlice, { type IAdminPaymentSlice } from "./admin/payment.slice";
import adminAnalyticsSlice, { type IAdminAnalyticsSlice } from "./admin/analytics.slice";
import adminContentSlice, { type IAdminContentSlice } from "./admin/content.slice";
import adminActivitySlice, { type IAdminActivitySlice } from "./admin/activity.slice";
import adminVenueSlice, { type IAdminVenueSlice } from "./admin/venue.slice";
import matchmakingSlice, { type IMatchmakingSlice } from "./player/matchmaking.slice";

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
  adminDashboardSlice: IAdminDashboardSlice;
  adminUserSlice: IAdminUserSlice;
  adminBookingSlice: IAdminBookingSlice;
  adminPaymentSlice: IAdminPaymentSlice;
  adminAnalyticsSlice: IAdminAnalyticsSlice;
  adminContentSlice: IAdminContentSlice;
  adminActivitySlice: IAdminActivitySlice;
  adminVenueSlice: IAdminVenueSlice;
  matchmakingSlice: IMatchmakingSlice;
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
  adminDashboardSlice,
  adminUserSlice,
  adminBookingSlice,
  adminPaymentSlice,
  adminAnalyticsSlice,
  adminContentSlice,
  adminActivitySlice,
  adminVenueSlice,
  matchmakingSlice,
};

export default reducers;
