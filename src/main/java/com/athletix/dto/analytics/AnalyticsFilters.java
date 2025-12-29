package com.athletix.dto.analytics;

public record AnalyticsFilters(
        String startDate,
        String endDate,
        Long venueId
) {}