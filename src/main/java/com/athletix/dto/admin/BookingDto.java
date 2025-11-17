package com.athletix.dto.admin;

public record BookingDto (
        Long id,
        String player,
        String venue,
        String slot,
        Double amount,
        String status
){}
