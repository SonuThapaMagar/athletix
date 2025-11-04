package com.athletix.controller;

import com.athletix.dto.slot.SlotResponse;
import com.athletix.service.BookingService;
import com.athletix.service.SlotService;
import com.athletix.service.VenueOwnerBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class SlotBookingController {

    private final BookingService bookingService;
    private final VenueOwnerBookingService ownerService;

    @PostMapping("/book/{slotId}")
    public ResponseEntity<SlotResponse> book(@PathVariable Long slotId, @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(bookingService.bookSlot(slotId, auth));
    }

    @DeleteMapping("/cancel/{slotId}")
    public ResponseEntity<?> cancel(@PathVariable Long slotId,
                                    @RequestHeader("Authorization") String auth) {
        bookingService.cancelBooking(slotId, auth);
        return ResponseEntity.ok("Cancelled");
    }

    @GetMapping("/my")
    public ResponseEntity<List<SlotResponse>> myBookings(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(bookingService.getMyBookings(auth));
    }

    @GetMapping("/my-venue")
    public ResponseEntity<List<SlotResponse>> myVenueBookings(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(ownerService.getMyVenueBookings(auth));
    }
}
