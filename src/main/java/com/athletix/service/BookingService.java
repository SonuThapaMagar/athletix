package com.athletix.service;

import com.athletix.dto.booking.BookingResponse;
import com.athletix.dto.slot.SlotResponse;
import com.athletix.entity.*;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.SlotRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
//@RequiredArgsConstructor
public class BookingService {

    private final SlotRepository slotRepository;
    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final PaymentService paymentService;

    public BookingService(SlotRepository slotRepository,
                          BookingRepository bookingRepository,
                          VenueRepository venueRepository,
                          JwtUtil jwtUtil,
                          AuthService authService,
                          PaymentService paymentService) {
        this.slotRepository = slotRepository;
        this.bookingRepository = bookingRepository;
        this.venueRepository = venueRepository;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.paymentService = paymentService;
    }

    /// BOOK A SLOT → Create PENDING Booking
//    public BookingResponse bookSlot(Long slotId, String authHeader) {
//        User player = authService.validatePlayer(authHeader);
//        Slot slot = slotRepository.findById(slotId)
//                .orElseThrow(() -> new RuntimeException("Slot not found"));
//
//        // Check if already booked
//        if (bookingRepository.existsBySlot_IdAndStatusIn(slotId, List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED))) {
//            throw new RuntimeException("Slot already booked");
//        }
//
//        double amount = paymentService.calculateAmount(slot);
//        Booking booking = Booking.builder()
//                .venue(slot.getVenue())
//                .player(player)
//                .slot(slot)
//                .startTime(slot.getStartTime())
//                .endTime(slot.getEndTime())
//                .amount(amount)
//                .status(BookingStatus.PENDING)
//                .paid(false)
//                .build();
//
//        booking = bookingRepository.save(booking);
//        return toResponse(booking);
//    }

    public List<BookingResponse> getMyBookings(String authHeader) {
        User player = authService.validatePlayer(authHeader);
        return bookingRepository.findByPlayer_UserId(player.getUserId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void cancelBooking(Long bookingId, String authHeader) {
        User player = authService.validatePlayer(authHeader);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getPlayer().getUserId().equals(player.getUserId())) {
            throw new RuntimeException("Not your booking");
        }
        if (booking.isPaid()) {
            throw new RuntimeException("Cannot cancel paid booking");
        }

        bookingRepository.delete(booking);
    }

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
                b.getSportType(),
                b.getStatus(),
                b.isPaid(),
                b.getCreatedAt()
        );
    }
}
