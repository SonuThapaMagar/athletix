package com.athletix.dto.payment;


public record PaymentSummary(
        Double totalRevenue,
        Double thisMonth,
        Double pending,
        Long totalTransactions
) {}