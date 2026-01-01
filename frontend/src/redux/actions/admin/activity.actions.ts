import requests from "@/helper/requests";
import { adminActivityActions } from "@/redux/slices/admin/activity.slice";
import { AppDispatch } from "@/redux/store";
import type { ActivityLog, ActivityFilters } from "@/types/admin/activity.types";
import type { PaginationResponse } from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_ACTIVITIES_ACTION = (filters?: ActivityFilters): Promise<{ activities: ActivityLog[]; pagination: any }> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminActivityActions.setLoading(true));

    requests.admin.activity
      .getActivities(filters)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<ActivityLog>>>) => {
        const paginatedData = res.data.data || res.data;
        const activities = paginatedData.items || [];
        const pagination = paginatedData.pagination;
        AppDispatch(adminActivityActions.setActivities({ activities, pagination }));
        resolve({ activities, pagination });
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch activities";
        AppDispatch(adminActivityActions.setError(message));
        reject(err);
      });
  });
