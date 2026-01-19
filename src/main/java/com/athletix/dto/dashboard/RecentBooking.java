package com.athletix.dto.dashboard;

import com.athletix.entity.BookingStatus;
import java.time.LocalDateTime;

public record RecentBooking(
        Long id,
        Long venueId,
        String venueName,
        Long playerId,
        String playerName,
        String sport,
        LocalDateTime startTime,
        LocalDateTime endTime,
        BookingStatus status,
        Double amount,
        boolean paid,
        LocalDateTime createdAt,
        String venueImage
) {}