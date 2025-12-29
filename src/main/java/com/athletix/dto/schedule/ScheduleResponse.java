package com.athletix.dto.schedule;

import com.athletix.entity.ScheduleType;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public record ScheduleResponse(
        Long id,
        Long venueId,
        String venueName,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        ScheduleType type,
        boolean isBlocked,
        String reason,
        String notes,
        LocalDateTime createdAt
) {}