package com.athletix.dto.admin;

public record AdminTopVenue(
        Long venueId,
        String venueName,
        Double revenue,
        Long bookings,
        Double growth
) {}