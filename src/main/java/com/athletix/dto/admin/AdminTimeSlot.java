package com.athletix.dto.admin;

public record AdminTimeSlot(
        String timeSlot,
        Long bookings
) {}