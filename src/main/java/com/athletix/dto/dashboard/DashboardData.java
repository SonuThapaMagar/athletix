package com.athletix.dto.dashboard;

import java.util.List;

public record DashboardData(
        DashboardStats stats,
        List<RecentBooking> recentBookings
) {}