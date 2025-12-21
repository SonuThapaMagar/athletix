package com.athletix.service;

import com.athletix.dto.slot.SlotRequest;
import com.athletix.dto.slot.SlotResponse;
import com.athletix.entity.BookingStatus;
import com.athletix.entity.Slot;
import com.athletix.entity.User;
import com.athletix.entity.Venue;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.SlotRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final SlotRepository slotRepository;
    private final VenueRepository venueRepository;
    private final AuthService authService;
    private final BookingRepository bookingRepository;

    public SlotResponse addSlot(Long venueId, SlotRequest req, String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
            throw new RuntimeException("Not your venue");
        }

        List<Slot> overlap = slotRepository.findByVenueAndStartTimeBetween(venue, req.startTime(), req.endTime());
        if (!overlap.isEmpty()) {
            throw new RuntimeException("Overlapping slot");
        }

        Slot slot = Slot.builder()
                .venue(venue)
                .startTime(req.startTime())
                .endTime(req.endTime())
                .build();

        return toResponse(slotRepository.save(slot));
    }

    public List<SlotResponse> getAvailableSlots(Long venueId) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        List<Slot> allSlots = slotRepository.findByVenue(venue);

        List<Long> bookedSlotIds = bookingRepository
                .findByVenue_IdAndStatusIn(venueId, List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED))
                .stream()
                .map(b -> b.getSlot().getId())
                .toList();

        return allSlots.stream()
                .filter(s -> !bookedSlotIds.contains(s.getId()))
                .map(this::toResponse)
                .toList();
    }

    public void removeSlot(Long slotId, String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.getVenue().getOwner().getUserId().equals(owner.getUserId())) {
            throw new RuntimeException("Not your slot");
        }

        // Check if booked
        if (bookingRepository.existsBySlot_IdAndStatusIn(slotId, List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED))) {
            throw new RuntimeException("Cannot remove booked slot");
        }

        slotRepository.delete(slot);
    }

    private SlotResponse toResponse(Slot s) {
        return new SlotResponse(
                s.getId(),
                s.getVenue().getId(),
                s.getVenue().getName(),
                s.getStartTime(),
                s.getEndTime()
        );
    }
}
