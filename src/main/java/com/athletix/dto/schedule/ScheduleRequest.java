package com.athletix.dto.schedule;

import com.athletix.entity.ScheduleType;
import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleRequest(
        Long venueId,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        ScheduleType type,
        Boolean isBlocked,
        String reason,
        String notes
) {}