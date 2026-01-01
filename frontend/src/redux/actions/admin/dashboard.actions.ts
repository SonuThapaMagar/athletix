import requests from "@/helper/requests";
import { adminDashboardActions } from "@/redux/slices/admin/dashboard.slice";
import { AppDispatch } from "@/redux/store";
import type { AdminDashboardStats, RecentActivity, AdminDashboardData } from "@/types/admin/dashboard.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_DASHBOARD_DATA_ACTION = (): Promise<AdminDashboardData> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminDashboardActions.setLoading(true));

    requests.admin.dashboard
      .getDashboardData()
      .then((res: AxiosResponse<ApiResponse<AdminDashboardData>>) => {
        const data = res.data.data || res.data;
        AppDispatch(adminDashboardActions.setDashboardData({
          stats: data.stats,
          recentActivities: data.recentActivities || [],
        }));
        resolve(data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch dashboard data";
        AppDispatch(adminDashboardActions.setError(message));
        reject(err);
      });
  });

export const FETCH_ADMIN_DASHBOARD_STATS_ACTION = (): Promise<AdminDashboardStats> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminDashboardActions.setLoading(true));

    requests.admin.dashboard
      .getStats()
      .then((res: AxiosResponse<ApiResponse<AdminDashboardStats>>) => {
        const stats = res.data.data || res.data;
        AppDispatch(adminDashboardActions.setStats(stats));
        resolve(stats);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch dashboard stats";
        AppDispatch(adminDashboardActions.setError(message));
        reject(err);
      });
  });

export const FETCH_RECENT_ACTIVITIES_ACTION = (limit?: number): Promise<RecentActivity[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminDashboardActions.setLoading(true));

    requests.admin.dashboard
      .getRecentActivities(limit)
      .then((res: AxiosResponse<ApiResponse<RecentActivity[]>>) => {
        const activities = res.data.data || res.data || [];
        AppDispatch(adminDashboardActions.setRecentActivities(activities));
        resolve(activities);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch recent activities";
        AppDispatch(adminDashboardActions.setError(message));
        reject(err);
      });
  });
