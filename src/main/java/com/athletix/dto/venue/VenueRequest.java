package com.athletix.dto.venue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record VenueRequest(
//        @NotBlank(message = "Name is required") String name,
//        @NotBlank(message = "Location is required") String location,
//        @NotEmpty(message = "At least one sport is required") List<@NotBlank String> sports,
//        @Positive(message = "Price per hour must be positive") Double pricePerHour,
//        @NotBlank(message = "Description is required") String description,
//        List<String> images,
//        List<String> amenities,
//        @NotEmpty(message = "Operating hours are required") List<@NotNull OperatingHour> operatingHours,
//        @NotNull(message = "Contact is required") Contact contact

        String name,
        String location,
        List<String> sports,
        Double pricePerHour,
        String description,
        List<String> images,
        List<String> amenities,
        List<OperatingHour> operatingHours,
        String phone,   // accept phone at root
        String email
) {}
