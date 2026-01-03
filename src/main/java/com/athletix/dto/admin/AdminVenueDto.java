package com.athletix.dto.admin;

public record AdminVenueDto(
        Long id,
        String name,
        String owner,
        Long ownerId,
        String status,
        Double pricePerHour,
        String location,
        String sport,
        String createdAt
) {}