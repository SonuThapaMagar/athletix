package com.athletix.dto.match;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RespondToRequestRequest(
        @NotBlank(message = "Action is required")
        @Pattern(regexp = "accept|reject", message = "Action must be 'accept' or 'reject'")
        String action
) {}