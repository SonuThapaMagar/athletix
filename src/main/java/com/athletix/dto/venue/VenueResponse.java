package com.athletix.dto.venue;

import java.time.LocalDateTime;
import java.util.List;

public record VenueResponse(
        Long id,
        String name,
        String location,
        List<String> sports,
        Double pricePerHour,
        String description,
        List<String> images,
        List<String> amenities,
        List<OperatingHour> operatingHours,
        String phone,
        String email,        Long ownerId,
        String ownerName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}