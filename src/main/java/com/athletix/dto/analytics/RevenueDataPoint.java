package com.athletix.dto.analytics;

public record RevenueDataPoint(
        String month,
        Double revenue,
        Integer year
) {}