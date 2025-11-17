package com.athletix.dto.admin;

public record RevenueReportDto (
        String date,
        Double revenue,
        Long bookings
){}
