package com.athletix.repository;

import com.athletix.entity.Slot;
import com.athletix.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
@Repository
public interface SlotRepository extends JpaRepository<Slot,Long> {
    List<Slot> findByVenueAndStartTimeBetween(Venue venue, LocalDateTime start, LocalDateTime end);
    List<Slot> findByVenue(Venue venue);
}
