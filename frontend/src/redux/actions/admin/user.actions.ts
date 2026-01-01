import requests from "@/helper/requests";
import { adminUserActions } from "@/redux/slices/admin/user.slice";
import { AppDispatch } from "@/redux/store";
import type { AdminUser, UserFilters } from "@/types/admin/user.types";
import type { PaginationResponse } from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_USERS_ACTION = (filters?: UserFilters): Promise<{ users: AdminUser[]; pagination: any }> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminUserActions.setLoading(true));

    requests.admin.user
      .getUsers(filters)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<AdminUser>>>) => {
        const paginatedData = res.data.data || res.data;
        const users = paginatedData.items || [];
        const pagination = paginatedData.pagination;
        AppDispatch(adminUserActions.setUsers({ users, pagination }));
        resolve({ users, pagination });
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch users";
        AppDispatch(adminUserActions.setError(message));
        reject(err);
      });
  });

export const FETCH_ADMIN_USER_BY_ID_ACTION = (userId: number): Promise<AdminUser> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminUserActions.setLoading(true));

    requests.admin.user
      .getUserById(userId)
      .then((res: AxiosResponse<ApiResponse<AdminUser>>) => {
        const user = res.data.data || res.data;
        AppDispatch(adminUserActions.setSelectedUser(user));
        AppDispatch(adminUserActions.setLoading(false));
        resolve(user);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch user";
        AppDispatch(adminUserActions.setError(message));
        reject(err);
      });
  });

export const UPDATE_ADMIN_USER_ACTION = (userId: number, data: Partial<AdminUser>): Promise<AdminUser> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminUserActions.setLoading(true));

    requests.admin.user
      .updateUser(userId, data)
      .then((res: AxiosResponse<ApiResponse<AdminUser>>) => {
        const user = res.data.data || res.data;
        AppDispatch(adminUserActions.updateUser(user));
        AppDispatch(adminUserActions.setLoading(false));
        resolve(user);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to update user";
        AppDispatch(adminUserActions.setError(message));
        reject(err);
      });
  });

export const DELETE_ADMIN_USER_ACTION = (userId: number): Promise<void> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminUserActions.setLoading(true));

    requests.admin.user
      .deleteUser(userId)
      .then(() => {
        AppDispatch(adminUserActions.removeUser(userId));
        AppDispatch(adminUserActions.setLoading(false));
        resolve();
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to delete user";
        AppDispatch(adminUserActions.setError(message));
        reject(err);
      });
  });
