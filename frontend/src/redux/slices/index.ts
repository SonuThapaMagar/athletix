import venueSlice, { type IVenuesSlice } from "@/redux/slices/venues/venueSlice";
import authSlice, { type IAuthSlice } from "./authSlice";

export interface StateType {
  venueSlice: IVenuesSlice;
  authSlice: IAuthSlice;
}

const reducers = {
  venueSlice,
  authSlice,
};

export default reducers;
