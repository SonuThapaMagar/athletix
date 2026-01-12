package com.athletix.dto.match;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record CreateMatchRequest(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        String description,

        @NotBlank(message = "Sport type is required")
        String sportType,

        @NotBlank(message = "Location is required")
        String location,

        @NotNull(message = "Match date and time is required")
        @Future(message = "Match date must be in the future")
        LocalDateTime matchDateTime,

        @NotNull(message = "Required players is required")
        @Min(value = 2, message = "At least 2 players required")
        @Max(value = 50, message = "Maximum 50 players allowed")
        Integer requiredPlayers,

        String skillLevel,
        String contactInfo,
        String additionalNotes
) {}