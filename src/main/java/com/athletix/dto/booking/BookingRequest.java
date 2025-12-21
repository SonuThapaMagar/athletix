package com.athletix.dto.booking;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record BookingRequest(
        @NotNull @Future LocalDateTime startTime,
        @NotNull LocalDateTime endTime
) {}
