import venueSlice, { type IVenuesSlice } from "@/redux/slices/venues/venueSlice";
import authSlice, { type IAuthSlice } from "./authSlice";
import playerVenueSlice, { type IPlayerVenuesSlice } from "./player/playerVenue.slice";
import venueBookingSlice, { type IVenueBookingSlice } from "./player/venueBooking.slice";
import venueOwnerBookingSlice, { type IVenueOwnerBookingSlice } from "./venueOwner/venueOwnerBooking.slice";

export interface StateType {
  venueSlice: IVenuesSlice;
  authSlice: IAuthSlice;
  playerVenueSlice: IPlayerVenuesSlice;
  venueBookingSlice: IVenueBookingSlice;
  venueOwnerBookingSlice: IVenueOwnerBookingSlice;
}

const reducers = {
  venueSlice,
  authSlice,
  playerVenueSlice,
  venueBookingSlice,
  venueOwnerBookingSlice,
};

export default reducers;
