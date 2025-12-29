package com.athletix.dto.analytics;

public record TopVenue(
        Long venueId,
        String venueName,
        Long bookings,
        Double revenue,
        Double growth
) {}
