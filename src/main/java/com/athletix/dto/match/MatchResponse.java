package com.athletix.dto.match;

import java.time.LocalDateTime;
import java.util.List;

public record MatchResponse(
        Long matchId,
        UserBasicInfo creator,
        String title,
        String description,
        String sportType,
        String location,
        LocalDateTime matchDateTime,
        Integer requiredPlayers,
        Integer currentPlayers,
        String skillLevel,
        String status,
        String contactInfo,
        String additionalNotes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isCreator,
        Boolean hasRequested,
        String requestStatus,
        List<AcceptedPlayerResponse> acceptedPlayers
) {
}