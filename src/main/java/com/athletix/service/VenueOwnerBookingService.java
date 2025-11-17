package com.athletix.service;

import com.athletix.dto.booking.BookingResponse;
import com.athletix.entity.User;
import com.athletix.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueOwnerBookingService {

    private final BookingRepository bookingRepository;
    private final AuthService authService;

    // VIEW BOOKINGS FOR MY VENUE
    public List<BookingResponse> getMyVenueBookings(String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);

        return bookingRepository.findByVenue_Owner_UserId(owner.getUserId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(com.athletix.entity.Booking b) {
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
}