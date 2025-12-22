// src/redux/actions/user.actions.ts
import requests from "@/helper/requests";
import { store } from "@/redux/store";
import { authActions } from "../slices/authSlice";
import type { IUserProfile } from "@/types/user.types/user.types";

export const FETCH_PROFILE = (): Promise<IUserProfile> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requests.user.getMyProfile(); 
      const profile: IUserProfile = res.data.data || res.data;
      // Store in redux
      store.dispatch(authActions.setUserProfile(profile));
      resolve(profile);
    } catch (err: any) {
      reject(err?.response?.data || err);
    }
  });
};

export const UPDATE_PROFILE_ACTION = (data: {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}): Promise<IUserProfile> => {
  return new Promise(async (resolve, reject) => {
    try {
      // ✅ Ensure we send all required fields to match backend DTO
      const updateData = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || ''
      };
      
      console.log('🔵 Sending update request:', updateData);
      const res = await requests.user.updateProfile(updateData);
      console.log('✅ Update response:', res.data);
      
      const updatedProfile: IUserProfile = res.data.data || res.data;
      // Update in redux
      store.dispatch(authActions.setUserProfile(updatedProfile));
      resolve(updatedProfile);
    } catch (err: any) {
      console.error('❌ Update error:', err?.response?.data || err);
      reject(err?.response?.data || err);
    }
  });
};

export const CHANGE_PASSWORD_ACTION = (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await requests.user.changePassword(data);
      resolve();
    } catch (err: any) {
      reject(err?.response?.data || err);
    }
  });
};