package com.athletix.controller;

import com.athletix.dto.booking.BookingResponse;
import com.athletix.entity.*;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.service.AuthService;
import com.athletix.service.BookingService;
import com.athletix.service.VenueOwnerBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final VenueOwnerBookingService ownerService;
    private final AuthService authService;
    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;

    /**
     * Create a pending booking (no slot required)
     */
    @PostMapping("/create-pending")
    public ResponseEntity<?> createPendingBooking(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateBookingRequest req
    ) {
        try {
            User player = authService.validatePlayer(authHeader);
            Venue venue = venueRepository.findById(req.venueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found"));

            LocalDateTime startTime = LocalDateTime.parse(req.startTime());
            LocalDateTime endTime = startTime.plusHours(req.durationHours());

            // Calculate amount
            double amount = venue.getPricePerHour() * req.durationHours();

            // Create booking
            Booking booking = Booking.builder()
                    .venue(venue)
                    .player(player)
                    .startTime(startTime)
                    .endTime(endTime)
                    .amount(amount)
                    .status(BookingStatus.PENDING)
                    .paid(false)
                    .build();

            booking = bookingRepository.save(booking);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", booking
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    record CreateBookingRequest(Long venueId, String startTime, int durationHours) {}

    /**
     * Cancel a booking (only if unpaid)
     */
    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancel(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String auth) {
        bookingService.cancelBooking(bookingId, auth);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    /**
     * Get my bookings (player view)
     */
    @GetMapping("/myBookings")
    public ResponseEntity<List<BookingResponse>> myBookings(
            @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(bookingService.getMyBookings(auth));
    }

    /**
     * Get bookings for my venues (owner view)
     */
    @GetMapping("/my-venue")
    public ResponseEntity<List<BookingResponse>> myVenueBookings(
            @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(ownerService.getMyVenueBookings(auth));
    }

    // === Helper Methods ===

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getVenue().getId(),
                b.getVenue().getName(),
                b.getPlayer().getUserId(),
                b.getPlayer().getName(),
                b.getStartTime(),
                b.getEndTime(),
                b.getAmount(),
                b.getStatus(),
                b.isPaid(),
                b.getCreatedAt()
        );
    }

    // === DTOs ===

    record PendingBookingRequest(
            Long venueId,
            String startTime, // ISO format: "2025-12-16T18:00:00"
            Integer durationHours
    ) {}
}