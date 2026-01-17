package com.athletix.controller;

import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.dto.payment.PaymentResponse;
import com.athletix.dto.payment.PaymentSummary;
import com.athletix.dto.response.ApiResponse;
import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import com.athletix.repository.BookingRepository;
import com.athletix.service.PaymentService;
import com.athletix.service.VenueOwnerPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingRepository bookingRepository;
    private final VenueOwnerPaymentService venueOwnerPaymentService;

    /**
     * Initiate eSewa payment - returns payment URL
     */
    @GetMapping("/esewa/initiate/{bookingId}")
    public ResponseEntity<String> initiateEsewa(@PathVariable Long bookingId) {
        try {
            System.out.println("🔵 Initiating eSewa payment for bookingId = " + bookingId);

            // Generate eSewa payment URL
            String url = paymentService.generateEsewaUrl(bookingId);

            System.out.println("🔵 Generated URL: " + url);

            // Return plain text URL
            return ResponseEntity.ok()
                    .header("Content-Type", "text/plain")
                    .body(url);

        } catch (Exception e) {
            System.err.println("❌ Error initiating payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Verify eSewa payment after redirect
     */
    @PostMapping("/esewa/verify")
    public ResponseEntity<?> verifyEsewa(@RequestBody VerifyRequest req) {
        try {
            System.out.println("🔵 Verifying payment for bookingId = " + req.bookingId());
            System.out.println("=".repeat(60));
            System.out.println("🔵 PAYMENT VERIFICATION REQUEST RECEIVED");
            System.out.println("=".repeat(60));
            System.out.println("   Booking ID: " + req.bookingId());
            System.out.println("   Transaction Code: " + req.refId());
            System.out.println("   Amount: " + req.amt());
            System.out.println("   Request from: Frontend (after eSewa callback)");
            System.out.println("=".repeat(60));

            // 1. Find booking
            Booking booking = bookingRepository.findById(req.bookingId())
                    .orElseThrow(() -> {
                        System.err.println("❌ Booking not found: " + req.bookingId());
                        return new RuntimeException("Booking not found");
                    });

            System.out.println("✅ Booking found");
            System.out.println("   Venue: " + booking.getVenue().getName());
            System.out.println("   Amount: " + booking.getAmount());
            System.out.println("   Current status: " + booking.getStatus());
            System.out.println("   Is paid: " + booking.isPaid());

            // 2. Check if already paid (prevent double processing)
            if (booking.isPaid()) {
                System.out.println("⚠️  Booking already paid - skipping verification");
                System.out.println("=".repeat(60));
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Booking already paid",
                        "booking", booking
                ));
            }
            // 3. Verify payment with eSewa API
            System.out.println("🔵 Calling eSewa verification API...");
            String result = paymentService.verifyAndConfirm(
                    req.bookingId(),
                    req.refId(),
                    req.amt()
            );

            // 4. Fetch updated booking
            booking.setPaid(true);
            booking.setStatus(BookingStatus.CONFIRMED); // 🎯 INSTANT CONFIRMATION
            booking.setPaymentRefId(req.refId());
            booking = bookingRepository.save(booking);

            System.out.println("=".repeat(60));
            System.out.println("✅ PAYMENT VERIFIED & BOOKING AUTO-CONFIRMED");
            System.out.println("=".repeat(60));
            System.out.println("   Booking ID: " + booking.getId());
            System.out.println("   Status: " + booking.getStatus());
            System.out.println("   Paid: " + booking.isPaid());
            System.out.println("   Sport: " + booking.getSportType());
            System.out.println("=".repeat(60));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment successful! Your booking is confirmed.",
                    "booking", booking
            ));

        } catch (Exception e) {
            System.err.println("=".repeat(60));
            System.err.println("❌ PAYMENT VERIFICATION FAILED");
            System.err.println("=".repeat(60));
            System.err.println("   Booking ID: " + req.bookingId());
            System.err.println("   Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=".repeat(60));

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", "Payment verification failed: " + e.getMessage()
                    ));
        }
    }

    @PostMapping("/esewa/failure")
    public ResponseEntity<?> handleFailure(@RequestParam Long bookingId) {
        try {
            System.out.println("🔴 Payment failed for bookingId = " + bookingId);

            bookingRepository.findById(bookingId).ifPresent(booking -> {
                booking.setStatus(BookingStatus.FAILED);
                bookingRepository.save(booking);
            });

            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Payment failed. Booking cancelled."
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ==================== VENUE OWNER PAYMENT MANAGEMENT ====================

    /**
     * GET /api/payments/venue-owner/summary
     * Get payment summary statistics for venue owner
     */
//    @GetMapping("/venue-owner/summary")
//    public ResponseEntity<ApiResponse<PaymentSummary>> getPaymentSummary(
//            @RequestHeader("Authorization") String authHeader
//    ) {
//        PaymentSummary summary = venueOwnerPaymentService.getPaymentSummary(authHeader);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(
//                        "success",
//                        "Payment summary fetched successfully",
//                        summary
//                )
//        );
//    }

    /**
     * GET /api/payments/venue-owner
     * Get all payments for venue owner with pagination and optional filtering
     */
//    @GetMapping("/venue-owner")
//    public ResponseEntity<ApiResponse<PaginationResponse<PaymentResponse>>> getMyPayments(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestParam(defaultValue = "1") int page,
//            @RequestParam(defaultValue = "10") int perPage,
//            @RequestParam(required = false, defaultValue = "all") String status
//    ) {
//        PaginationResponse<PaymentResponse> payments = venueOwnerPaymentService.getMyPayments(
//                authHeader,
//                page,
//                perPage,
//                status
//        );
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(
//                        "success",
//                        "Payments fetched successfully",
//                        payments
//                )
//        );
//    }

    /**
     * GET /api/payments/venue-owner/{id}
     * Get single payment details
     */
//    @GetMapping("/venue-owner/{id}")
//    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
//            @RequestHeader("Authorization") String authHeader,
//            @PathVariable Long id
//    ) {
//        PaymentResponse payment = venueOwnerPaymentService.getPaymentById(authHeader, id);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(
//                        "success",
//                        "Payment details fetched successfully",
//                        payment
//                )
//        );
//    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Payment controller is working!");
    }
}

record VerifyRequest(Long bookingId, String refId, String amt, String signature) {}