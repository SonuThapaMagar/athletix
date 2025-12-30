// src/redux/actions/venueOwner/schedule.actions.ts
import requests from "@/helper/requests";
import { scheduleActions } from "@/redux/slices/venueOwner/schedule.slice";
import { AppDispatch } from "@/redux/store";
import type { Schedule } from "@/types/venueOwner/schedule.types";
import type { AxiosResponse } from "axios";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all schedules (optionally filtered by venue)
 */
export const FETCH_SCHEDULES_ACTION = (params?: {
  venueId?: number;
  startDate?: string;
  endDate?: string;
}): Promise<Schedule[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(scheduleActions.setLoading(true));

    requests.schedule
      .getSchedules(params)
      .then((res: AxiosResponse<ApiResponse<Schedule[]>>) => {
        const schedules = res.data.data || res.data || [];
        AppDispatch(scheduleActions.setSchedules(schedules));
        AppDispatch(scheduleActions.setLoading(false));
        resolve(schedules);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch schedules";
        AppDispatch(scheduleActions.setError(message));
        AppDispatch(scheduleActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Create a new schedule
 */
export const CREATE_SCHEDULE_ACTION = (data: {
  venueId: number;
  date: string;
  startTime: string;
  endTime: string;
  type?: string;
  isBlocked?: boolean;
  reason?: string;
  notes?: string;
}): Promise<Schedule> =>
  new Promise((resolve, reject) => {
    AppDispatch(scheduleActions.setLoading(true));

    requests.schedule
      .createSchedule(data)
      .then((res: AxiosResponse<ApiResponse<Schedule>>) => {
        const schedule = res.data.data || res.data;
        AppDispatch(scheduleActions.addSchedule(schedule));
        AppDispatch(scheduleActions.setLoading(false));
        resolve(schedule);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to create schedule";
        AppDispatch(scheduleActions.setError(message));
        AppDispatch(scheduleActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Update an existing schedule
 */
export const UPDATE_SCHEDULE_ACTION = (
  scheduleId: number,
  data: Partial<{
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    isBlocked: boolean;
    reason: string;
    notes: string;
  }>
): Promise<Schedule> =>
  new Promise((resolve, reject) => {
    AppDispatch(scheduleActions.setLoading(true));

    requests.schedule
      .updateSchedule(scheduleId, data)
      .then((res: AxiosResponse<ApiResponse<Schedule>>) => {
        const schedule = res.data.data || res.data;
        AppDispatch(scheduleActions.updateSchedule(schedule));
        AppDispatch(scheduleActions.setLoading(false));
        resolve(schedule);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to update schedule";
        AppDispatch(scheduleActions.setError(message));
        AppDispatch(scheduleActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Delete a schedule
 */
export const DELETE_SCHEDULE_ACTION = (scheduleId: number): Promise<void> =>
  new Promise((resolve, reject) => {
    AppDispatch(scheduleActions.setLoading(true));

    requests.schedule
      .deleteSchedule(scheduleId)
      .then(() => {
        AppDispatch(scheduleActions.removeSchedule(scheduleId));
        AppDispatch(scheduleActions.setLoading(false));
        resolve();
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to delete schedule";
        AppDispatch(scheduleActions.setError(message));
        AppDispatch(scheduleActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Block a date
 */
export const BLOCK_DATE_ACTION = (data: {
  venueId: number;
  date: string;
  reason: string;
}): Promise<Schedule> =>
  new Promise((resolve, reject) => {
    AppDispatch(scheduleActions.setLoading(true));

    requests.schedule
      .blockDate(data)
      .then((res: AxiosResponse<ApiResponse<Schedule>>) => {
        const schedule = res.data.data || res.data;
        AppDispatch(scheduleActions.addSchedule(schedule));
        AppDispatch(scheduleActions.setLoading(false));
        resolve(schedule);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to block date";
        AppDispatch(scheduleActions.setError(message));
        AppDispatch(scheduleActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Unblock a schedule
 */
export const UNBLOCK_SCHEDULE_ACTION = (scheduleId: number): Promise<Schedule> =>
  new Promise((resolve, reject) => {
    AppDispatch(scheduleActions.setLoading(true));

    requests.schedule
      .unblockSchedule(scheduleId)
      .then((res: AxiosResponse<ApiResponse<Schedule>>) => {
        const schedule = res.data.data || res.data;
        AppDispatch(scheduleActions.updateSchedule(schedule));
        AppDispatch(scheduleActions.setLoading(false));
        resolve(schedule);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to unblock schedule";
        AppDispatch(scheduleActions.setError(message));
        AppDispatch(scheduleActions.setLoading(false));
        reject(err);
      });
  });

/**
 * Generate schedules from operating hours
 */
export const GENERATE_SCHEDULES_ACTION = (
  venueId: number,
  startDate: string,
  endDate: string
): Promise<Schedule[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(scheduleActions.setLoading(true));

    requests.schedule
      .generateSchedules(venueId, startDate, endDate)
      .then((res: AxiosResponse<ApiResponse<Schedule[]>>) => {
        const schedules = res.data.data || res.data || [];
        AppDispatch(scheduleActions.setSchedules(schedules));
        AppDispatch(scheduleActions.setLoading(false));
        resolve(schedules);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to generate schedules";
        AppDispatch(scheduleActions.setError(message));
        AppDispatch(scheduleActions.setLoading(false));
        reject(err);
      });
  });