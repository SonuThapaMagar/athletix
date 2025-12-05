// File: src/main/java/com/athletix/dto/venue/OperatingHour.java
package com.athletix.dto.venue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OperatingHour(
//        @NotBlank String day,
//        @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Invalid time format") String openTime,
//        @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Invalid time format") String closeTime

        String day,
        String openTime,
        String closeTime

) {}