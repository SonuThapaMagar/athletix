package com.athletix.service;

import com.athletix.dto.slot.SlotRequest;
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
public class SlotService {

    private final SlotRepository slotRepository;
    private final VenueRepository venueRepository;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    // ADD SLOT
    public SlotResponse addSlot(Long venueId, SlotRequest req, String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
            throw new RuntimeException("Not your venue");
        }

        List<Slot> overlap = slotRepository.findByVenueAndStartTimeBetween(
                venue, req.startTime(), req.endTime());
        if (!overlap.isEmpty()) throw new RuntimeException("Overlapping slot");

        Slot slot = Slot.builder()
                .venue(venue)
                .startTime(req.startTime())
                .endTime(req.endTime())
                .isBooked(false)
                .build();

        return toResponse(slotRepository.save(slot));
    }

    // REMOVE SLOT (Only if not booked)
    public void removeSlot(Long slotId, String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.getVenue().getOwner().getUserId().equals(owner.getUserId())) {
            throw new RuntimeException("Not your slot");
        }
        if (slot.isBooked()) {
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
                s.getEndTime(),
                s.isBooked(),
                s.getBookedBy() != null ? s.getBookedBy().getUserId() : null,
                s.getBookedBy() != null ? s.getBookedBy().getName() : null
        );
    }

    public List<SlotResponse> getAvailableSlots(Long venueId) {
        return null;
    }
}
