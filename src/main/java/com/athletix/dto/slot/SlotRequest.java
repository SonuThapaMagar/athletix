package com.athletix.dto.slot;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record SlotRequest(
        @NotNull @Future LocalDateTime startTime,
        @NotNull LocalDateTime endTime
) {}
