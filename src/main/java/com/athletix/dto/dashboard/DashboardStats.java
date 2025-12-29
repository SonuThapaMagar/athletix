package com.athletix.dto.dashboard;

public record DashboardStats(
        Double totalRevenue,
        Integer activeBookings,
        Integer totalVenues,
        Double customerRating,
        Double revenueChange,
        Double bookingsChange,
        Integer venuesChange,
        Double ratingChange
) {}