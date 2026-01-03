package com.athletix.dto.admin;

public record AdminPaymentSummary(
        Double totalRevenue,
        Long totalTransactions,
        Long completedPayments,
        Long pendingPayments,
        Long failedPayments,
        Long refundedPayments
) {}