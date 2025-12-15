import venueSlice, { type IVenuesSlice } from "@/redux/slices/venues/venueSlice";
import authSlice, { type IAuthSlice } from "./authSlice";
import playerVenueSlice, { type IPlayerVenuesSlice } from "./player/playerVenue.slice";

export interface StateType {
  venueSlice: IVenuesSlice;
  authSlice: IAuthSlice;
  playerVenueSlice: IPlayerVenuesSlice;
}

const reducers = {
  venueSlice,
  authSlice,
  playerVenueSlice,
};

export default reducers;
