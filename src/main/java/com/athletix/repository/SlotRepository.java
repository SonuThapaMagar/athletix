package com.athletix.repository;

import com.athletix.entity.Slot;
import com.athletix.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot,Long> {
    List<Slot> findByVenueAndStartTimeBetween(Venue venue, LocalDateTime start, LocalDateTime end);
    List<Slot> findByVenueAndIsBookedFalse(Venue venue);
    List<Slot> findByBookedBy_UserIdAndIsBookedTrue(Long userId);
    List<Slot> findByVenue_Owner_UserId(Long userId);
}
