package com.athletix.controller;

import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.dto.payment.PaymentResponse;
import com.athletix.dto.payment.PaymentSummary;
import com.athletix.dto.response.ApiResponse;
import com.athletix.service.VenueOwnerPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/venue-owner")
@RequiredArgsConstructor
public class VenueOwnerPaymentController {

    private final VenueOwnerPaymentService paymentService;

    /**
     * GET /api/payments/venue-owner
     * Get all payments for venue owner with pagination and optional filters
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<PaymentResponse>>> getPayments(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(required = false) String status
    ) {
        PaginationResponse<PaymentResponse> payments = paymentService.getMyPayments(
                authHeader,
                page,
                perPage,
                status
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Payments fetched successfully",
                        payments
                )
        );
    }

    /**
     * GET /api/payments/venue-owner/summary
     * Get payment summary/statistics
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<PaymentSummary>> getSummary(
            @RequestHeader("Authorization") String authHeader
    ) {
        PaymentSummary summary = paymentService.getPaymentSummary(authHeader);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Payment summary fetched successfully",
                        summary
                )
        );
    }

    /**
     * GET /api/payments/venue-owner/{paymentId}
     * Get single payment by ID
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long paymentId
    ) {
        PaymentResponse payment = paymentService.getPaymentById(authHeader, paymentId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Payment fetched successfully",
                        payment
                )
        );
    }

    /**
     * GET /api/payments/venue-owner/export
     * Export payments to CSV/Excel
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportPayments(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long venueId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "csv") String format
    ) {
        // TODO: Implement export functionality
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=payments." + format)
                .header("Content-Type", "text/csv")
                .body(new byte[0]);
    }
}