package com.athletix.dto.admin;

public record AdminAnalyticsStats(
        Double totalRevenue,
        Long totalBookings,
        Long activeUsers,
        Long totalVenues,
        Double revenueChange,
        Double bookingsChange,
        Double usersChange,
        Double venuesChange
) {}