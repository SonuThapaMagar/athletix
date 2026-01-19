package com.athletix.controller;

import com.athletix.dto.booking.BookingResponse;
import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.dto.response.ApiResponse;
import com.athletix.entity.*;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.PaymentRepository;
import com.athletix.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;


    /**
     * Check availability before booking
     */
    @PostMapping("/check-availability")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkAvailability(
            @RequestBody AvailabilityRequest req) {
        try {
            LocalDateTime startTime = LocalDateTime.parse(req.startTime());
            LocalDateTime endTime = startTime.plusHours(req.durationHours());

            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    req.venueId(),
                    startTime,
                    endTime,
                    List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
            );

            boolean available = overlapping.isEmpty();

            Map<String, Object> data = Map.of(
                    "available", available,
                    "message", available
                            ? "Time slot is available"
                            : "This time slot is already booked. Please choose another time.",
                    "conflictingBookings", available ? 0 : overlapping.size()
            );

            return ResponseEntity.ok(
                    new ApiResponse<>("success", "Availability checked", data)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    record AvailabilityRequest(Long venueId, String startTime, int durationHours) {}
    // === Helper Methods ===


    /**
     * Create a pending booking (no slot required)
     */
//    @PostMapping("/create-pending")
//    public ResponseEntity<?> createPendingBooking(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestBody CreateBookingRequest req
//    ) {
//        try {
//            User player = authService.validatePlayer(authHeader);
//            Venue venue = venueRepository.findById(req.venueId())
//                    .orElseThrow(() -> new RuntimeException("Venue not found"));
//
//            LocalDateTime startTime = LocalDateTime.parse(req.startTime());
//            LocalDateTime endTime = startTime.plusHours(req.durationHours());
//            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
//                    req.venueId(),
//                    startTime,
//                    endTime,
//                    List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
//            );
//
//            if (!overlapping.isEmpty()) {
//                return ResponseEntity.badRequest()
//                        .body(Map.of("success", false, "message", "Time slot is already booked"));
//            }
//
//            if (req.sportType() != null && !venue.getSportTypes().contains(req.sportType())) {
//                return ResponseEntity.badRequest().body(Map.of(
//                        "success", false,
//                        "message", "Selected sport is not available at this venue"
//                ));
//            }
//
//            startTime = LocalDateTime.parse(req.startTime());
//            endTime = startTime.plusHours(req.durationHours());
//
//            // Calculate amount
//            double amount = venue.getPricePerHour() * req.durationHours();
//
//            // Create booking
//            Booking booking = Booking.builder()
//                    .venue(venue)
//                    .player(player)
//                    .startTime(startTime)
//                    .endTime(endTime)
//                    .amount(amount)
//                    .sportType(req.sportType())
//                    .status(BookingStatus.PENDING)
//                    .paid(false)
//                    .build();
//
//            booking = bookingRepository.save(booking);
//
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "data", booking
//            ));
//
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("success", false, "message", e.getMessage()));
//        }
//    }

    /**
     * Get my bookings (player view)
     */
    @GetMapping("/myBookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> myBookings(
            @RequestHeader("Authorization") String auth) {
        try {
            List<BookingResponse> bookings = bookingService.getMyBookings(auth);
            return ResponseEntity.ok(
                    new ApiResponse<>("success", "Bookings retrieved successfully", bookings)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    /**
     * ✅ Cancel booking (only if unpaid)
     */
    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<ApiResponse<String>> cancelBooking(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String auth) {
        try {
            String token = auth.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
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
            } else {
                throw new RuntimeException("Not authorized");
            }

            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);

            return ResponseEntity.ok(
                    new ApiResponse<>("success", "Booking cancelled successfully", null)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    /**
     * Get bookings for my venues (owner view)
     */
    @GetMapping("/my-venue")
    public ResponseEntity<ApiResponse<PaginationResponse<BookingResponse>>> myVenueBookings(
            @RequestHeader("Authorization") String auth,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer perPage) {

        PaginationResponse<BookingResponse> response = ownerService.getMyVenueBookings(auth, page, perPage);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Venue bookings retrieved successfully",
                        response
                )
        );
    }

    /**
     * ✅ NEW: Get single booking by ID
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String auth) {
        try {
            String token = auth.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Verify user has access to this booking
            boolean isPlayer = user.getRole().name().equals("PLAYER") &&
                    booking.getPlayer().getUserId().equals(user.getUserId());
            boolean isOwner = user.getRole().name().equals("VENUE_OWNER") &&
                    booking.getVenue().getOwner().getUserId().equals(user.getUserId());

            if (!isPlayer && !isOwner) {
                throw new RuntimeException("Not authorized to view this booking");
            }

            return ResponseEntity.ok(
                    new ApiResponse<>("success", "Booking retrieved successfully", toResponse(booking))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    @PostMapping("/create-pending")
    public ResponseEntity<ApiResponse<Booking>> createPendingBooking(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateBookingRequest req) {
        try {
            User player = authService.validatePlayer(authHeader);
            Venue venue = venueRepository.findById(req.venueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found"));

            LocalDateTime startTime = LocalDateTime.parse(req.startTime());
            LocalDateTime endTime = startTime.plusHours(req.durationHours());

            // Check for overlapping bookings
            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    req.venueId(),
                    startTime,
                    endTime,
                    List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
            );

            if (!overlapping.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>("error", "Time slot is already booked", null));
            }

            if (req.sportType() != null && !venue.getSportTypes().contains(req.sportType())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>("error", "Selected sport is not available at this venue", null));
            }

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

            // CREATE PAYMENT RECORD IMMEDIATELY
            Payment payment = Payment.builder()
                    .booking(booking)
                    .amount(amount)
                    .status("pending")
                    .build();
            paymentRepository.save(payment);

            System.out.println("✅ Created PENDING payment record for booking " + booking.getId());

            return ResponseEntity.ok(
                    new ApiResponse<>("success", "Booking created successfully", booking)
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }


    private BookingResponse toResponse(Booking b) {
        String venueImage = null;

        if (b.getVenue().getImages() != null && !b.getVenue().getImages().isEmpty()) {
            venueImage = b.getVenue().getImages().get(0);
        }

        return new BookingResponse(
                        b.getId(),
                        b.getVenue().getId(),
                        b.getVenue().getName(),
                        venueImage,
                        b.getPlayer().getUserId(),
                        b.getPlayer().getName(),
                        b.getStartTime(),
                b.getEndTime(),
                b.getAmount(),
                b.getSportType(),
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