package com.athletix.dto.admin;

public record PendingVenueResponse(
        Long id,
        String name,
        String location,
        String ownerName
) {}