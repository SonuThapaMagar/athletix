package com.athletix.repository;

import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPlayer_UserId(Long playerId);

    List<Booking> findByVenue_Owner_UserId(Long ownerId);

    List<Booking> findByVenue_IdAndStatusIn(Long venueId, List<BookingStatus> statuses);

    boolean existsBySlot_IdAndStatusIn(Long slotId, List<BookingStatus> statuses);

    /**
     * Check if venue has overlapping bookings in given time range
     * Returns true if there's any PENDING or CONFIRMED booking that overlaps
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
            "FROM Booking b " +
            "WHERE b.venue.id = :venueId " +
            "AND b.status IN ('PENDING', 'CONFIRMED') " +
            "AND NOT (b.endTime <= :startTime OR b.startTime >= :endTime)")
    boolean existsByVenueAndTimeOverlap(
            @Param("venueId") Long venueId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    /**
     * Find all overlapping bookings for a venue in given time range
     */
    @Query("SELECT b FROM Booking b " +
            "WHERE b.venue.id = :venueId " +
            "AND b.status IN ('PENDING', 'CONFIRMED') " +
            "AND NOT (b.endTime <= :startTime OR b.startTime >= :endTime)")
    List<Booking> findOverlappingBookings(
            @Param("venueId") Long venueId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}