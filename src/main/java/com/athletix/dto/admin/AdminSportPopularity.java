package com.athletix.dto.admin;

public record AdminSportPopularity(
        String sport,
        Long bookings,
        Double percentage
) {}