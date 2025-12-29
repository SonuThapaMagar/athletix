package com.athletix.dto.analytics;

import java.util.List;

public record AnalyticsData(
        AnalyticsStats stats,
        List<RevenueDataPoint> revenueData,
        List<TopVenue> topVenues,
        List<SportPopularity> sportPopularity,
        List<TimeSlot> peakBookingTimes
) {}
