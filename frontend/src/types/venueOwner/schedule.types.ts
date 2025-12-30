// src/types/venueOwner/schedule.types.ts

export type ScheduleType = 'NORMAL' | 'EXTENDED' | 'REDUCED' | 'CLOSED' | 'MAINTENANCE' | 'SPECIAL_EVENT';

export interface Schedule {
  id: number;
  venueId: number;
  venueName: string;
  date: string; // YYYY-MM-DD format (LocalDate)
  startTime: string | null; // HH:mm format (LocalTime) or null if blocked
  endTime: string | null; // HH:mm format (LocalTime) or null if blocked
  type: ScheduleType;
  isBlocked: boolean;
  reason: string | null;
  notes: string | null;
  createdAt: string; // ISO timestamp
}

export interface CreateSchedulePayload {
  venueId: number;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (optional)
  endTime?: string; // HH:mm (optional)
  type?: ScheduleType;
  isBlocked?: boolean;
  reason?: string;
  notes?: string;
}

export interface UpdateSchedulePayload {
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: ScheduleType;
  isBlocked?: boolean;
  reason?: string;
  notes?: string;
}

export interface BlockDatePayload {
  venueId: number;
  date: string; // YYYY-MM-DD
  reason: string;
}