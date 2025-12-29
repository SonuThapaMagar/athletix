package com.athletix.dto.payment;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long bookingId,
        String bookingRefId,
        Long venueId,
        String venueName,
        String customerName,
        String customerEmail,
        LocalDateTime bookingDate,
        Double amount,
        String paymentMethod,
        String status,
        String refId,
        LocalDateTime createdAt
) {}