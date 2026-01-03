package com.athletix.dto.admin;

public record AdminRevenueDataPoint(
        String month,
        Double revenue,
        Integer year
) {}