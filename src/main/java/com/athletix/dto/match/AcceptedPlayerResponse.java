package com.athletix.dto.match;

import java.time.LocalDateTime;

public record AcceptedPlayerResponse(
        Long playerId,
        String playerName,
        String playerEmail,
        String playerPhone,
        String playerLocation,
        LocalDateTime acceptedAt
) {
}