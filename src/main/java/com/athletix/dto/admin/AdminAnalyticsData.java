package com.athletix.dto.admin;

import java.util.List;

public record AdminAnalyticsData(
        AdminAnalyticsStats stats,
        List<AdminRevenueDataPoint> revenueData,
        List<AdminTopVenue> topVenues,
        List<AdminSportPopularity> sportPopularity,
        List<AdminTimeSlot> peakBookingTimes
) {}