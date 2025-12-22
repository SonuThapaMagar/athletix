package com.athletix.controller;

import com.athletix.dto.booking.BookingResponse;
import com.athletix.entity.*;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.security.JwtUtil;
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
    private final JwtUtil jwtUtil;

    /**
     * Check availability before booking
     */
    @PostMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(@RequestBody AvailabilityRequest req) {
        try {
            LocalDateTime startTime = LocalDateTime.parse(req.startTime());
            LocalDateTime endTime = startTime.plusHours(req.durationHours());

            // Check for overlapping bookings
            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    req.venueId(),
                    startTime,
                    endTime,
                    List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
            );

            boolean available = overlapping.isEmpty();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "available", available,
                    "message", available
                            ? "Time slot is available"
                            : "This time slot is already booked. Please choose another time.",
                    "conflictingBookings", available ? List.of() : overlapping.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    record AvailabilityRequest(Long venueId, String startTime, int durationHours) {}
    // === Helper Methods ===


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
            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    req.venueId(),
                    startTime,
                    endTime,
                    List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
            );

            if (!overlapping.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Time slot is already booked"));
            }

            if (req.sportType() != null && !venue.getSportTypes().contains(req.sportType())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Selected sport is not available at this venue"
                ));
            }

            startTime = LocalDateTime.parse(req.startTime());
            endTime = startTime.plusHours(req.durationHours());

            // Calculate amount
            double amount = venue.getPricePerHour() * req.durationHours();

            // Create booking
            Booking booking = Booking.builder()
                    .venue(venue)
                    .player(player)
                    .startTime(startTime)
                    .endTime(endTime)
                    .amount(amount)
                    .sportType(req.sportType())
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

    /**
     * Get my bookings (player view)
     */
    @GetMapping("/myBookings")
    public ResponseEntity<?> myBookings(
            @RequestHeader("Authorization") String auth) {
        try {
            List<BookingResponse> bookings = bookingService.getMyBookings(auth);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", bookings
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * ✅ Cancel booking (only if unpaid)
     */
    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String auth) {
        try {
            String token = auth.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = authService.userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Players can only cancel unpaid bookings
            if (user.getRole().name().equals("PLAYER")) {
                if (!booking.getPlayer().getUserId().equals(user.getUserId())) {
                    throw new RuntimeException("Not authorized");
                }
                if (booking.isPaid()) {
                    throw new RuntimeException("Cannot cancel paid booking. Please contact support.");
                }
            }
            // Venue owners can cancel any booking (for emergency closures, etc.)
            else if (user.getRole().name().equals("VENUE_OWNER")) {
                if (!booking.getVenue().getOwner().getUserId().equals(user.getUserId())) {
                    throw new RuntimeException("Not authorized");
                }
                // TODO: Implement refund logic here if paid
            } else {
                throw new RuntimeException("Not authorized");
            }

            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Booking cancelled successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Get bookings for my venues (owner view)
     */
    @GetMapping("/my-venue")
    public ResponseEntity<List<BookingResponse>> myVenueBookings(
            @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(ownerService.getMyVenueBookings(auth));
    }

    /**
     * Cancel a booking (only if unpaid)
     */
//    @DeleteMapping("/cancel/{bookingId}")
//    public ResponseEntity<?> cancel(
//            @PathVariable Long bookingId,
//            @RequestHeader("Authorization") String auth) {
//        bookingService.cancelBooking(bookingId, auth);
//        return ResponseEntity.ok("Booking cancelled successfully");
//    }

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
    record CreateBookingRequest(
            Long venueId,
            String startTime,
            int durationHours,
            String sportType) {}

    record PendingBookingRequest(
            Long venueId,
            String startTime, // ISO format: "2025-12-16T18:00:00"
            Integer durationHours
    ) {}
}