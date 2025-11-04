package com.athletix.service;

import com.athletix.dto.slot.SlotResponse;
import com.athletix.entity.Slot;
import com.athletix.entity.User;
import com.athletix.entity.Venue;
import com.athletix.repository.SlotRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final SlotRepository slotRepository;
    private final VenueRepository venueRepository;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    // BOOK SLOT
    public SlotResponse bookSlot(Long slotId, String authHeader) {
        User player = authService.validatePlayer(authHeader);
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.isBooked()) throw new RuntimeException("Already booked");

        slot.setBookedBy(player);
        slot.setBooked(true);
        return toResponse(slotRepository.save(slot));
    }


    public List<SlotResponse> getAvailableSlots(Long venueId) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        return slotRepository.findByVenueAndIsBookedFalse(venue).stream()
                .map(this::toResponse)
                .toList();
    }

    public void cancelBooking(Long slotId, String authHeader) {
        User player = authService.validatePlayer(authHeader);
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.isBooked() || !slot.getBookedBy().getUserId().equals(player.getUserId())) {
            throw new RuntimeException("Not your booking");
        }

        slot.setBookedBy(null);
        slot.setBooked(false);
        slotRepository.save(slot);
    }

    public List<SlotResponse> getMyBookings(String authHeader) {
        User player = authService.validatePlayer(authHeader);
        return slotRepository.findByBookedBy_UserIdAndIsBookedTrue(player.getUserId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private SlotResponse toResponse(Slot s) {
        return new SlotResponse(
                s.getId(),
                s.getVenue().getId(),
                s.getVenue().getName(),
                s.getStartTime(),
                s.getEndTime(),
                s.isBooked(),
                s.getBookedBy() != null ? s.getBookedBy().getUserId() : null,
                s.getBookedBy() != null ? s.getBookedBy().getName() : null
        );
    }
}
