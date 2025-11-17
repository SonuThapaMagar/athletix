package com.athletix.repository;

import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPlayer_UserId(Long playerId);
    List<Booking> findByVenue_Owner_UserId(Long ownerId);
    List<Booking> findBySlot_Venue_IdAndStatusIn(Long venueId, List<BookingStatus> statuses);
    boolean existsBySlot_IdAndStatusIn(Long slotId, List<BookingStatus> statuses);
}