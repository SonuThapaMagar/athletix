package com.athletix.dto.booking;

import com.athletix.entity.BookingStatus;

import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        Long venueId,
        String venueName,
        Long playerId,
        String playerName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Double amount,
        BookingStatus status,
        boolean paid,
        LocalDateTime createdAt
) {}