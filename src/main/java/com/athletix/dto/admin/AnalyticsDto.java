package com.athletix.dto.admin;

public record AnalyticsDto (
        Long totalUsers,
        Long totalVenues,
        Long totalBookings,
        Double totalRevenue
){}
