package com.athletix.service;

import com.athletix.dto.pagination.Pagination;
import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.dto.payment.PaymentResponse;
import com.athletix.dto.payment.PaymentSummary;
import com.athletix.entity.Payment;
import com.athletix.entity.User;
import com.athletix.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueOwnerPaymentService {

    private final PaymentRepository paymentRepository;
    private final AuthService authService;

    /**
     * Get payment summary statistics for venue owner
     */
    public PaymentSummary getPaymentSummary(String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);

        // Calculate summary statistics
        Double totalRevenue = paymentRepository.calculateTotalRevenue(owner.getUserId());
        if (totalRevenue == null) totalRevenue = 0.0;

        // Get start of current month
        Double monthlyRevenue = paymentRepository.calculateTotalRevenueForOwner(owner.getUserId());
        if (monthlyRevenue == null) monthlyRevenue = 0.0;


        Double pendingAmount = paymentRepository.calculatePendingAmount(owner.getUserId());
        if (pendingAmount == null) pendingAmount = 0.0;

        Long totalTransactions = paymentRepository.countTotalTransactions(owner.getUserId());
        if (totalTransactions == null) totalTransactions = 0L;

        // Return numeric values directly (frontend will format them)
        return new PaymentSummary(
                totalRevenue,
                monthlyRevenue,
                pendingAmount,
                totalTransactions
        );
    }

    /**
     * Get all payments for venue owner with pagination and optional status filter
     */
    public PaginationResponse<PaymentResponse> getMyPayments(
            String authHeader,
            int page,
            int perPage,
            String status
    ) {
        User owner = authService.validateVenueOwner(authHeader);

        int pageIndex = Math.max(page - 1, 0);
        PageRequest pageable = PageRequest.of(
                pageIndex,
                perPage,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Payment> paymentPage;

        if (status != null && !status.equalsIgnoreCase("all")) {
            paymentPage = paymentRepository.findByVenueOwnerAndStatus(
                    owner.getUserId(),
                    status,
                    pageable
            );
        } else {
            paymentPage = paymentRepository.findByVenueOwner(
                    owner.getUserId(),
                    pageable
            );
        }

        List<PaymentResponse> paymentResponses = paymentPage.getContent().stream()
                .map(this::toPaymentResponse)
                .collect(Collectors.toList());

        // Use your existing pagination field names: per_page, total_record, total_page
        Pagination pagination = new Pagination(
                page,
                perPage,  // This will map to per_page
                paymentPage.getTotalElements(),  // This will map to total_record
                Math.max(paymentPage.getTotalPages(), 1)  // This will map to total_page
        );

        return new PaginationResponse<>(paymentResponses, pagination);
    }

    /**
     * Get single payment details
     */
    public PaymentResponse getPaymentById(String authHeader, Long paymentId) {
        User owner = authService.validateVenueOwner(authHeader);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Verify ownership
        if (!payment.getBooking().getVenue().getOwner().getUserId().equals(owner.getUserId())) {
            throw new RuntimeException("Not authorized to view this payment");
        }

        return toPaymentResponse(payment);
    }

    /**
     * Helper method to convert Payment entity to PaymentResponse DTO
     */
    private PaymentResponse toPaymentResponse(Payment payment) {
        var booking = payment.getBooking();
        var venue = booking.getVenue();
        var player = booking.getPlayer();

        // Override status for accurate display (based on reliable booking.paid flag)
        String displayStatus = booking.isPaid() ? "completed" : "pending";

        // Use refId from Payment if available, fallback to booking's paymentRefId
        String refId = payment.getRefId() != null ? payment.getRefId() : booking.getPaymentRefId();

        return new PaymentResponse(
                payment.getId(),                  // 1. id
                booking.getId(),                  // 2. bookingId
                "BK-" + booking.getCreatedAt().getYear() + "-" + String.format("%03d", booking.getId()), // 3. bookingRefId
                venue.getId(),                    // 4. venueId
                venue.getName(),                  // 5. venueName
                player.getName(),                 // 6. customerName
                player.getEmail(),                // 7. customerEmail
                booking.getStartTime(),           // 8. bookingDate
                payment.getAmount(),              // 9. amount
                "ESEWA",                          // 10. paymentMethod
                displayStatus,                    // 11. status
                refId,                            // 12. refId
                payment.getCreatedAt()            // 13. createdAt
        );
    }
}