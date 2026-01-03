package com.athletix.dto.admin;

public record AdminBookingDto(
        Long id,
        Long venueId,
        String venueName,
        Long playerId,
        String playerName,
        String playerEmail,
        String sport,
        String startTime,
        String endTime,
        String status,
        Double amount,
        Boolean paid,
        String createdAt,
        String bookingRefId
) {}