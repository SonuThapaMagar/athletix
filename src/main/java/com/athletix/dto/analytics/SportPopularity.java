package com.athletix.dto.analytics;

public record SportPopularity(
        String sport,
        Double percentage,
        Long bookings
) {}
