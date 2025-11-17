package com.athletix.controller;

import com.athletix.dto.booking.BookingResponse;
import com.athletix.dto.slot.SlotResponse;
import com.athletix.service.BookingService;
import com.athletix.service.VenueOwnerBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final VenueOwnerBookingService ownerService;

    @PostMapping("/book/{slotId}")
    public ResponseEntity<BookingResponse> book(
            @PathVariable Long slotId,
            @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(bookingService.bookSlot(slotId, auth));
    }

    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancel(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String auth) {
        bookingService.cancelBooking(bookingId, auth);
        return ResponseEntity.ok("Cancelled");
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> myBookings(
            @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(bookingService.getMyBookings(auth));
    }

    @GetMapping("/my-venue")
    public ResponseEntity<List<BookingResponse>> myVenueBookings(
            @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(ownerService.getMyVenueBookings(auth));
    }
}
