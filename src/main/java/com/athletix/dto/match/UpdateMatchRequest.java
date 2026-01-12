package com.athletix.dto.match;

import java.time.LocalDateTime;

public record UpdateMatchRequest(
        String title,
        String description,
        String location,
        LocalDateTime matchDateTime,
        Integer requiredPlayers,
        String skillLevel,
        String contactInfo,
        String additionalNotes,
        String status
) {}