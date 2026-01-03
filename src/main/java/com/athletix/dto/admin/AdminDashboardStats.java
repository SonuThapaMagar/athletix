package com.athletix.dto.admin;

public record AdminDashboardStats(
        Long totalUsers,
        Long activeVenues,
        Double totalRevenue,
        Long totalBookings,
        Double usersChange,
        Double venuesChange,
        Double revenueChange,
        Double bookingsChange
) {}