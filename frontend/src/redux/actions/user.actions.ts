// src/redux/actions/user.actions.ts
import requests from "@/helper/requests";
import { store } from "@/redux/store";
import { authActions } from "../slices/authSlice";
import type { IUserProfile } from "@/types/user.types/user.types";

export const FETCH_PROFILE = (): Promise<IUserProfile> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requests.user.getMyProfile(); 
      const profile: IUserProfile = res.data;
      // Store in redux
      store.dispatch(authActions.setUserProfile(profile));
      resolve(profile);
    } catch (err: any) {
      reject(err?.response?.data || err);
    }
  });
};
