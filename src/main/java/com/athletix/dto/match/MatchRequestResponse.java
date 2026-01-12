package com.athletix.dto.match;

import java.time.LocalDateTime;

public record MatchRequestResponse(
        Long requestId,
        Long matchId,
        UserBasicInfo player,
        String message,
        String status,
        LocalDateTime requestedAt,
        LocalDateTime respondedAt
) {}