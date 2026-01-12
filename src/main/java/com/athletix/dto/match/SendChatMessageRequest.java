package com.athletix.dto.match;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendChatMessageRequest(
        @NotBlank(message = "Message is required")
        @Size(max = 1000, message = "Message must be less than 1000 characters")
        String message
) {}