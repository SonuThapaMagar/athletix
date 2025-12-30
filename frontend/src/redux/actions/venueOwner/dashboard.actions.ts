import requests from "@/helper/requests";
import { dashboardActions } from "@/redux/slices/venueOwner/dashboard.slice";
import { AppDispatch } from "@/redux/store";
import type { DashboardStats, RecentBooking, DashboardData } from "@/types/venueOwner/dashboard.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

/**
 * Fetch dashboard data (stats and recent bookings)
 */
export const FETCH_DASHBOARD_DATA_ACTION = (): Promise<DashboardData> =>
  new Promise((resolve, reject) => {
    AppDispatch(dashboardActions.setLoading(true));

    requests.venueOwnerDashboard
      .getDashboardData()
      .then((res: AxiosResponse<ApiResponse<DashboardData>>) => {
        const data = res.data.data || res.data;
        AppDispatch(dashboardActions.setDashboardData({
          stats: data.stats,
          recentBookings: data.recentBookings || [],
        }));
        resolve(data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch dashboard data";
        AppDispatch(dashboardActions.setError(message));
        reject(err);
      });
  });

/**
 * Fetch dashboard statistics only
 */
export const FETCH_DASHBOARD_STATS_ACTION = (): Promise<DashboardStats> =>
  new Promise((resolve, reject) => {
    AppDispatch(dashboardActions.setLoading(true));

    requests.venueOwnerDashboard
      .getStats()
      .then((res: AxiosResponse<ApiResponse<DashboardStats>>) => {
        const stats = res.data.data || res.data;
        AppDispatch(dashboardActions.setStats(stats));
        resolve(stats);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch dashboard stats";
        AppDispatch(dashboardActions.setError(message));
        reject(err);
      });
  });

/**
 * Fetch recent bookings only
 */
export const FETCH_RECENT_BOOKINGS_ACTION = (limit?: number): Promise<RecentBooking[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(dashboardActions.setLoading(true));

    requests.venueOwnerDashboard
      .getRecentBookings(limit)
      .then((res: AxiosResponse<ApiResponse<RecentBooking[]>>) => {
        const bookings = res.data.data || res.data || [];
        AppDispatch(dashboardActions.setRecentBookings(bookings));
        resolve(bookings);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch recent bookings";
        AppDispatch(dashboardActions.setError(message));
        reject(err);
      });
  });
