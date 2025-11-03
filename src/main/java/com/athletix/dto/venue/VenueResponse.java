package com.athletix.dto.venue;

import java.time.LocalDateTime;
import java.util.List;

public record VenueResponse (
    Long id,
    String name,
    String address,
    String city,
    List<String> sportTypes,
    Double pricePerHour,
    String description,
    List<String> images,
    Long ownerId,
    String ownerName,
    boolean isVerified,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
){}
