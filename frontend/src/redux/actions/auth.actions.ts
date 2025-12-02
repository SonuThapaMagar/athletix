import requests from "@/helper/requests";
import { store } from "../store";
import { authActions } from "../slices/authSlice";
import type { IUser } from "@/types/user.types/user.types";
import type { IAuthReq, IAuthRes } from "@/types/auth.types";

export const REGISTER_ACTION = (data: IUser): Promise<IAuthRes> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requests.user.auth.register(data);
      const auth = res.data;
      resolve(auth);
    } catch (err: any) {
      reject(err?.response?.data || err);
    }
  });
};

export const LOGIN_ACTION = (data: IAuthReq): Promise<IAuthRes> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requests.user.auth.login(data);
      const auth = res.data;

      // Save tokens & role
      localStorage.setItem("accessToken", auth.accessToken);
      localStorage.setItem("refreshToken", auth.refreshToken);
      localStorage.setItem("userRole", auth.userRole);

      // Update redux state
      store.dispatch(authActions.signInSuccess({ role: auth.userRole }));

      resolve(auth);
    } catch (err: any) {
      reject(err?.response?.data || err);
    }
  });
};

export const LOGOUT_ACTION = () => {
  return new Promise(async (resolve) => {
    try {
      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");

      // Update Redux state
      store.dispatch(authActions.signOut());

      resolve(true);
    } catch (err) {
      resolve(false);
    }
  });
};
