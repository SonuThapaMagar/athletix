package com.athletix.dto.venue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record VenueRequest(
        @NotBlank String name,
        @NotBlank String address,
        @NotBlank String city,
        @NotEmpty List<String> sportTypes,  // e.g., ["Football", "Cricket"]
        @Positive Double pricePerHour,
        String description,
        List<String> images  // URLs or base64 later
) {}
