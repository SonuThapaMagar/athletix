package com.athletix.dto.analytics;

public record AnalyticsStats(
        Double totalRevenue,
        Long totalBookings,
        Long activeCustomers,
        Double averageRating,
        Double revenueChange,
        Double bookingsChange,
        Double customersChange,
        Double ratingChange
) {}