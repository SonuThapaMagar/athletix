import api from "@/api/api";
import type { VenueSubmitData } from "@/types/venue.types/venue.types";

const user = {
  auth: {
    login: (data: { email: string; password: string }) => api.post("/auth/login", data),
    register: (data: { name: string; email: string; password: string; phone: string; location: string; role: string }) =>
      api.post("/auth/register", data),
    refreshToken: () => api.post("/auth/refresh", { refreshToken: localStorage.getItem("refreshToken") }), // Matches your backend
    sendOtp: (email: string) => api.post("/auth/forgot-password", { email }),
    verifyOtpAndResetPassword: (data: { email: string; otp: string; newPassword: string }) =>
      api.post("/auth/reset-password", data),
  },
  getMyProfile: () => api.get("/users/myProfile"),
  updateProfile: (data: { name?: string; phone?: string; location?: string }) => api.put("/users/myProfile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.post("/users/changePassword", data),
}

const notifications = {
  // Get all notifications
  getNotifications: (params?: { page?: number; perPage?: number }) =>
    api.get("/notifications", { params }),

  // Get unread notifications only
  getUnreadNotifications: (params?: { page?: number; perPage?: number }) =>
    api.get("/notifications/unread", { params }),

  // Get unread count
  getUnreadCount: () => api.get("/notifications/unread-count"),

  // Mark as read
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),

  // Mark all as read
  markAllAsRead: () => api.put("/notifications/mark-all-read"),

  // Delete notification
  deleteNotification: (id: number) => api.delete(`/notifications/${id}`),
};

const venueMgmt = {
  getVenues: (params: { page?: number; perPage?: number }) =>
    api.get("/venues", { params }),
  getMyVenues: (params?: { page?: number; perPage?: number }) =>
    api.get("/venues/myVenues", { params }),
  createVenue: (data: VenueSubmitData) => api.post("/venues", data),
  getVenueById: (id: number) => api.get(`/venues/${id}`),
  updateVenue: (id: number, data: any) => api.put(`/venues/${id}`, data),
  deleteVenue: (id: number) => api.delete(`/venues/${id}`),
}

const booking = {
  checkAvailability: (data: {
    venueId: number;
    startTime: string;
    durationHours: number;
  }) => api.post("/bookings/check-availability", data),
  createPending: (data: {
    venueId: number;
    startTime: string;
    durationHours: number;
    sportType?: string;

  }) => api.post("/bookings/create-pending", data),
  getMyBookings: () => api.get("/bookings/myBookings"),
  getBookingById: (bookingId: number) => api.get(`/bookings/${bookingId}`),
  cancelBooking: (bookingId: number) => api.delete(`/bookings/cancel/${bookingId}`),
  getMyVenueBookings: (params?: { page?: number; perPage?: number }) =>
    api.get("/bookings/my-venue", { params }), confirmBooking: (bookingId: number) => api.put(`/bookings/confirm/${bookingId}`),
};

const payment = {
  initiateEsewa: (bookingId: number) =>
    api.get(`/payments/esewa/initiate/${bookingId}`, { responseType: "text" }),
  verifyEsewa: (data: { bookingId: number; refId: string; amt: string; signature?: string }) =>
    api.post("/payments/esewa/verify", data),
  handleFailure: (bookingId: number) =>
    api.post(`/payments/esewa/failure`, null, {
      params: { bookingId }
    }),
  handleSuccess: (bookingId: number) =>
    api.post(`/payments/esewa/success`, null, {
      params: { bookingId }
    }),

};

const schedule = {
  // Get schedules (with optional filters)
  getSchedules: (params?: { venueId?: number; startDate?: string; endDate?: string }) =>
    api.get("/schedules", { params }),

  // Get schedules for specific venue
  getVenueSchedules: (venueId: number, params?: { startDate?: string; endDate?: string }) =>
    api.get(`/schedules/venue/${venueId}`, { params }),

  // Create or update schedule
  createSchedule: (data: {
    venueId: number;
    date: string;
    startTime?: string;
    endTime?: string;
    type?: string;
    isBlocked?: boolean;
    reason?: string;
    notes?: string;
  }) => api.post("/schedules", data),

  // Update schedule (not used - create endpoint handles updates)
  updateSchedule: (id: number, data: any) => api.put(`/schedules/${id}`, data),

  // Delete schedule
  deleteSchedule: (id: number) => api.delete(`/schedules/${id}`),

  // Block a date
  blockDate: (data: { venueId: number; date: string; reason: string }) =>
    api.post("/schedules/block", data),

  // Unblock a schedule
  unblockSchedule: (scheduleId: number) =>
    api.post(`/schedules/unblock/${scheduleId}`),

  // Generate schedules from operating hours
  generateSchedules: (venueId: number, startDate: string, endDate: string) =>
    api.post(`/schedules/generate/${venueId}`, null, {
      params: { startDate, endDate }
    }),
};

const venueOwnerPayment = {
  // Get all payments for venue owner
  getPayments: (params?: {
    status?: string;
    venueId?: number;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
  }) => api.get("/payments/venue-owner", { params }),

  // Get payment summary/statistics
  getSummary: (params?: {
    startDate?: string;
    endDate?: string;
    venueId?: number;
  }) => api.get("/payments/venue-owner/summary", { params }),

  // Get single payment by ID
  getPaymentById: (paymentId: number) => api.get(`/payments/venue-owner/${paymentId}`),

  // Export payments to CSV/Excel
  exportPayments: (params?: {
    status?: string;
    venueId?: number;
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'excel';
  }) => api.get("/payments/venue-owner/export", { params, responseType: 'blob' }),
};

const venueOwnerDashboard = {
  // Get complete dashboard data (stats + recent bookings)
  getDashboardData: () => api.get("/venue-owner/dashboard"),

  // Get dashboard statistics only
  getStats: () => api.get("/venue-owner/dashboard/stats"),

  // Get recent bookings for dashboard
  getRecentBookings: (limit?: number) =>
    api.get("/venue-owner/dashboard/recent-bookings", { params: { limit } }),
};

const venueOwnerAnalytics = {
  // Get complete analytics data
  getAnalyticsData: (params?: { startDate?: string; endDate?: string; venueId?: number }) =>
    api.get("/venue-owner/analytics", { params }),

  // Get analytics statistics only
  getStats: (params?: { startDate?: string; endDate?: string; venueId?: number }) =>
    api.get("/venue-owner/analytics/stats", { params }),

  // Get revenue data (monthly/periodic)
  getRevenueData: (params?: { startDate?: string; endDate?: string; venueId?: number }) =>
    api.get("/venue-owner/analytics/revenue", { params }),

  // Get top performing venues
  getTopVenues: (params?: { startDate?: string; endDate?: string; limit?: number }) =>
    api.get("/venue-owner/analytics/top-venues", { params }),

  // Get sport popularity data
  getSportPopularity: (params?: { startDate?: string; endDate?: string; venueId?: number }) =>
    api.get("/venue-owner/analytics/sport-popularity", { params }),

  // Get peak booking times
  getPeakBookingTimes: (params?: { startDate?: string; endDate?: string; venueId?: number }) =>
    api.get("/venue-owner/analytics/peak-times", { params }),

  // Export analytics data
  exportAnalytics: (params?: { startDate?: string; endDate?: string; venueId?: number; format?: 'csv' | 'excel' }) =>
    api.get("/venue-owner/analytics/export", { params, responseType: 'blob' }),
};

const admin = {
  dashboard: {
    getDashboardData: () => api.get("/admin/dashboard"),
    getStats: () => api.get("/admin/dashboard/stats"),
    getRecentActivities: (limit?: number) =>
      api.get("/admin/dashboard/recent-activities", { params: { limit } }),
  },
  user: {
    getUsers: (params?: any) => api.get("/admin/users", { params }),
    getUserById: (userId: number) => api.get(`/admin/users/${userId}`),
    updateUser: (userId: number, data: any) => api.put(`/admin/users/${userId}`, data),
    deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  },
  venue: {
    getVenues: (params?: any) => api.get("/admin/venues", { params }),
    getVenueById: (venueId: number) => api.get(`/admin/venues/${venueId}`),
    updateVenue: (venueId: number, data: any) => api.put(`/admin/venues/${venueId}`, data),
    deleteVenue: (venueId: number) => api.delete(`/admin/venues/${venueId}`),
  },
  booking: {
    getBookings: (params?: any) => api.get("/admin/bookings", { params }),
    getBookingById: (bookingId: number) => api.get(`/admin/bookings/${bookingId}`),
  },
  payment: {
    getPayments: (params?: any) => api.get("/admin/payments", { params }),
    getSummary: (params?: any) => api.get("/admin/payments/summary", { params }),
    exportPayments: (params?: any) => api.get("/admin/payments/export", { params, responseType: 'blob' }),
  },
  analytics: {
    getAnalyticsData: (params?: any) => api.get("/admin/analytics", { params }),
    getStats: (params?: any) => api.get("/admin/analytics/stats", { params }),
    exportAnalytics: (params?: any) => api.get("/admin/analytics/export", { params, responseType: 'blob' }),
  },
  content: {
    getContentItems: (params?: any) => api.get("/admin/content", { params }),
    moderateContent: (contentId: number, action: 'approve' | 'reject') =>
      api.put(`/admin/content/${contentId}`, { action }),
  },
  activity: {
    getActivities: (params?: any) => api.get("/admin/activities", { params }),
  },
};

const player = {
  matchmaking: {
    getMatches: (params?: any) => api.get("/player/matches", { params }),
    getMyMatches: () => api.get("/player/matches/my"),
    getMatchById: (matchId: number) => api.get(`/player/matches/${matchId}`),
    createMatch: (data: any) => api.post("/player/matches", data),
    deleteMatch: (matchId: number) => api.delete(`/player/matches/${matchId}`),
    requestToJoin: (matchId: number, message?: string) => api.post(`/player/matches/${matchId}/request`, { message }),
    respondToRequest: (requestId: number, action: 'accept' | 'reject') => api.put(`/player/matches/requests/${requestId}`, { action }),
    getMatchRequests: (matchId: number) => api.get(`/player/matches/${matchId}/requests`),


    getChatMessages: (matchId: number, page: number = 0, size: number = 50) =>
      api.get(`/player/matches/${matchId}/chat`, { params: { page, size } }),
    sendChatMessage: (matchId: number, message: string) =>
      api.post(`/player/matches/${matchId}/chat`, { content: message }),

    // Get player profile by userId
    getPlayerProfile: (userId: number) => api.get(`/player/profile/${userId}`),
  },
  venueChat: {
    getMessages: (venueId: number) => api.get(`/player/venues/${venueId}/chat`),
    sendMessage: (venueId: number, message: string) => api.post(`/player/venues/${venueId}/chat`, { message }),
  },
};

const requests = { user, venueMgmt, notifications, booking, payment, schedule, venueOwnerPayment, venueOwnerDashboard, venueOwnerAnalytics, admin, player };
export default requests;