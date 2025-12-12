package com.athletix.dto.admin;

public record VenueDto (
        Long id,
        String name,
        String owner,
//        String status,
        Double pricePerHour
){}
