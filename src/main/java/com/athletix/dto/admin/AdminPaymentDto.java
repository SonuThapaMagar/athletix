package com.athletix.dto.admin;

public record AdminPaymentDto(
        Long id,
        Long bookingId,
        String bookingRefId,
        Long venueId,
        String venueName,
        String customerName,
        String customerEmail,
        String bookingDate,
        Double amount,
        String paymentMethod,
        String status,
        String refId,
        String createdAt
) {}