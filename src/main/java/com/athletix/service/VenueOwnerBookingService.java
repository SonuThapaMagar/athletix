package com.athletix.service;

import com.athletix.dto.slot.SlotResponse;
import com.athletix.entity.Slot;
import com.athletix.entity.User;
import com.athletix.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueOwnerBookingService {

    private final SlotRepository slotRepository;
    private final AuthService authService;

    // VIEW BOOKINGS FOR MY VENUE
    public List<SlotResponse> getMyVenueBookings(String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);
        return slotRepository.findByVenue_Owner_UserId(owner.getUserId())
                .stream()
                .filter(Slot::isBooked)
                .map(this::toResponse)
                .toList();
    }

    // APPROVE (optional — auto-approved on booking)
    // Or add status: PENDING → CONFIRMED

    private SlotResponse toResponse(Slot s) {
        return new SlotResponse(
                s.getId(),
                s.getVenue().getId(),
                s.getVenue().getName(),
                s.getStartTime(),
                s.getEndTime(),
                true,
                s.getBookedBy().getUserId(),
                s.getBookedBy().getName()
        );
    }
}