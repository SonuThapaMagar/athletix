package com.athletix.dto.match;

import jakarta.validation.constraints.Size;

public record JoinMatchRequest(
        @Size(max = 500, message = "Message must be less than 500 characters")
        String message
) {}