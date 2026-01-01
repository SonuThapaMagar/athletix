import requests from "@/helper/requests";
import { adminAnalyticsActions } from "@/redux/slices/admin/analytics.slice";
import { AppDispatch } from "@/redux/store";
import type { AdminAnalyticsData, AdminAnalyticsStats, RevenueDataPoint, TopVenue, SportPopularity, TimeSlot, AnalyticsFilters } from "@/types/admin/analytics.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_ANALYTICS_DATA_ACTION = (filters?: AnalyticsFilters): Promise<AdminAnalyticsData> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminAnalyticsActions.setLoading(true));

    requests.admin.analytics
      .getAnalyticsData(filters)
      .then((res: AxiosResponse<ApiResponse<AdminAnalyticsData>>) => {
        const data = res.data.data || res.data;
        AppDispatch(adminAnalyticsActions.setAnalyticsData({
          stats: data.stats,
          revenueData: data.revenueData || [],
          topVenues: data.topVenues || [],
          sportPopularity: data.sportPopularity || [],
          peakBookingTimes: data.peakBookingTimes || [],
        }));
        resolve(data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch analytics data";
        AppDispatch(adminAnalyticsActions.setError(message));
        reject(err);
      });
  });

export const FETCH_ADMIN_ANALYTICS_STATS_ACTION = (filters?: AnalyticsFilters): Promise<AdminAnalyticsStats> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminAnalyticsActions.setLoading(true));

    requests.admin.analytics
      .getStats(filters)
      .then((res: AxiosResponse<ApiResponse<AdminAnalyticsStats>>) => {
        const stats = res.data.data || res.data;
        AppDispatch(adminAnalyticsActions.setStats(stats));
        resolve(stats);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch analytics stats";
        AppDispatch(adminAnalyticsActions.setError(message));
        reject(err);
      });
  });

export const EXPORT_ADMIN_ANALYTICS_ACTION = (filters?: AnalyticsFilters & { format?: 'csv' | 'excel' }): Promise<Blob> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminAnalyticsActions.setLoading(true));

    requests.admin.analytics
      .exportAnalytics(filters)
      .then((res: AxiosResponse<Blob>) => {
        AppDispatch(adminAnalyticsActions.setLoading(false));
        resolve(res.data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to export analytics";
        AppDispatch(adminAnalyticsActions.setError(message));
        reject(err);
      });
  });
