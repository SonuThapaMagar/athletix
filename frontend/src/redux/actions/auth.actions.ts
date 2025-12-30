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
  return new Promise((resolve) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    store.dispatch(authActions.signOut());

    resolve(true);
  });
};

export const SEND_OTP_ACTION = (email: string): Promise<{ message: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requests.user.auth.sendOtp(email);
      resolve(res.data);
    } catch (err: any) {
      reject(err?.response?.data || err);
    }
  });
};

export const VERIFY_OTP_AND_RESET_PASSWORD_ACTION = (data: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requests.user.auth.verifyOtpAndResetPassword(data);
      resolve(res.data);
    } catch (err: any) {
      reject(err?.response?.data || err);
    }
  });
};

