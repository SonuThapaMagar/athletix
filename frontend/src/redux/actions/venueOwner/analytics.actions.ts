import requests from "@/helper/requests";
import { analyticsActions } from "@/redux/slices/venueOwner/analytics.slice";
import { AppDispatch } from "@/redux/store";
import type { AnalyticsData, AnalyticsFilters, AnalyticsStats, RevenueDataPoint, TopVenue, SportPopularity, TimeSlot } from "@/types/venueOwner/analytics.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

/**
 * Fetch complete analytics data
 */
export const FETCH_ANALYTICS_DATA_ACTION = (filters?: AnalyticsFilters): Promise<AnalyticsData> =>
  new Promise((resolve, reject) => {
    AppDispatch(analyticsActions.setLoading(true));

    requests.venueOwnerAnalytics
      .getAnalyticsData(filters)
      .then((res: AxiosResponse<ApiResponse<AnalyticsData>>) => {
        const data = res.data.data || res.data;
        AppDispatch(analyticsActions.setAnalyticsData({
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
        AppDispatch(analyticsActions.setError(message));
        reject(err);
      });
  });

/**
 * Fetch analytics statistics only
 */
export const FETCH_ANALYTICS_STATS_ACTION = (filters?: AnalyticsFilters): Promise<AnalyticsStats> =>
  new Promise((resolve, reject) => {
    AppDispatch(analyticsActions.setLoading(true));

    requests.venueOwnerAnalytics
      .getStats(filters)
      .then((res: AxiosResponse<ApiResponse<AnalyticsStats>>) => {
        const stats = res.data.data || res.data;
        AppDispatch(analyticsActions.setStats(stats));
        resolve(stats);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch analytics stats";
        AppDispatch(analyticsActions.setError(message));
        reject(err);
      });
  });

/**
 * Fetch revenue data
 */
export const FETCH_REVENUE_DATA_ACTION = (filters?: AnalyticsFilters): Promise<RevenueDataPoint[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(analyticsActions.setLoading(true));

    requests.venueOwnerAnalytics
      .getRevenueData(filters)
      .then((res: AxiosResponse<ApiResponse<RevenueDataPoint[]>>) => {
        const data = res.data.data || res.data || [];
        AppDispatch(analyticsActions.setRevenueData(data));
        resolve(data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch revenue data";
        AppDispatch(analyticsActions.setError(message));
        reject(err);
      });
  });

/**
 * Fetch top venues
 */
export const FETCH_TOP_VENUES_ACTION = (filters?: AnalyticsFilters): Promise<TopVenue[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(analyticsActions.setLoading(true));

    requests.venueOwnerAnalytics
      .getTopVenues(filters)
      .then((res: AxiosResponse<ApiResponse<TopVenue[]>>) => {
        const data = res.data.data || res.data || [];
        AppDispatch(analyticsActions.setTopVenues(data));
        resolve(data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch top venues";
        AppDispatch(analyticsActions.setError(message));
        reject(err);
      });
  });

/**
 * Fetch sport popularity data
 */
export const FETCH_SPORT_POPULARITY_ACTION = (filters?: AnalyticsFilters): Promise<SportPopularity[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(analyticsActions.setLoading(true));

    requests.venueOwnerAnalytics
      .getSportPopularity(filters)
      .then((res: AxiosResponse<ApiResponse<SportPopularity[]>>) => {
        const data = res.data.data || res.data || [];
        AppDispatch(analyticsActions.setSportPopularity(data));
        resolve(data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch sport popularity";
        AppDispatch(analyticsActions.setError(message));
        reject(err);
      });
  });

/**
 * Fetch peak booking times
 */
export const FETCH_PEAK_BOOKING_TIMES_ACTION = (filters?: AnalyticsFilters): Promise<TimeSlot[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(analyticsActions.setLoading(true));

    requests.venueOwnerAnalytics
      .getPeakBookingTimes(filters)
      .then((res: AxiosResponse<ApiResponse<TimeSlot[]>>) => {
        const data = res.data.data || res.data || [];
        AppDispatch(analyticsActions.setPeakBookingTimes(data));
        resolve(data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch peak booking times";
        AppDispatch(analyticsActions.setError(message));
        reject(err);
      });
  });

/**
 * Export analytics data to CSV/Excel
 */
export const EXPORT_ANALYTICS_ACTION = (filters?: AnalyticsFilters & { format?: 'csv' | 'excel' }): Promise<Blob> =>
  new Promise((resolve, reject) => {
    AppDispatch(analyticsActions.setLoading(true));

    requests.venueOwnerAnalytics
      .exportAnalytics(filters)
      .then((res: AxiosResponse<Blob>) => {
        AppDispatch(analyticsActions.setLoading(false));
        resolve(res.data);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to export analytics";
        AppDispatch(analyticsActions.setError(message));
        AppDispatch(analyticsActions.setLoading(false));
        reject(err);
      });
  });
