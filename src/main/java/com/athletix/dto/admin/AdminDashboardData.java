package com.athletix.dto.admin;

import java.util.List;

public record AdminDashboardData(
        AdminDashboardStats stats,
        List<AdminRecentActivity> recentActivities
) {}