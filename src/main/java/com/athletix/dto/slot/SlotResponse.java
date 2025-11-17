package com.athletix.dto.slot;

import java.time.LocalDateTime;

public record SlotResponse (
        Long id,
        Long venueId,
        String venueName,
        LocalDateTime startTime,
        LocalDateTime endTime
){}
