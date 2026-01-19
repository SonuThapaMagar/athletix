package com.athletix.repository;

import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPlayer_UserId(Long playerId);

//    List<Booking> findByVenue_Owner_UserId(Long ownerId);
    @Query("SELECT b FROM Booking b WHERE b.venue.owner.userId = :ownerId")
    List<Booking> findByVenueOwnerUserId(@Param("ownerId") Long ownerId);

    @Query("SELECT b FROM Booking b WHERE b.venue.owner.userId = :ownerId")
    Page<Booking> findByVenueOwnerUserId(
            @Param("ownerId") Long ownerId,
            Pageable pageable
    );
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

    @Query("SELECT b FROM Booking b WHERE b.venue.id = :venueId " +
            "AND b.status IN :statuses " +
            "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findOverlappingBookings(
            @Param("venueId") Long venueId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("statuses") List<BookingStatus> statuses
    );

    // Count active bookings (PENDING or CONFIRMED) for venue owner
    @Query("""
    SELECT COUNT(b) FROM Booking b
    WHERE b.venue.owner.userId = :ownerId
    AND b.status IN ('PENDING', 'CONFIRMED')
""")
    Long countActiveBookings(@Param("ownerId") Long ownerId);

    // Get recent bookings for venue owner (limited)
    @Query("""
    SELECT b FROM Booking b
    WHERE b.venue.owner.userId = :ownerId
    ORDER BY b.createdAt DESC
""")
    List<Booking> findRecentBookingsByOwner(@Param("ownerId") Long ownerId, Pageable pageable);

    // ========== ANALYTICS QUERIES ==========

    /**
     * Get monthly revenue - Fixed ORDER BY issue
     */
    @Query("""
        SELECT 
            MONTH(b.startTime) as month,
            YEAR(b.startTime) as year,
            COALESCE(SUM(p.amount), 0.0) as revenue
        FROM Booking b
        LEFT JOIN Payment p ON p.booking.id = b.id
        WHERE b.venue.owner.userId = :ownerId
        AND p.status = 'completed'
        AND b.startTime BETWEEN :startDate AND :endDate
        GROUP BY YEAR(b.startTime), MONTH(b.startTime)
        ORDER BY YEAR(b.startTime), MONTH(b.startTime)
    """)
    List<Object[]> getMonthlyRevenue(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Get top performing venues
     */
    @Query("""
        SELECT 
            v.id,
            v.name,
            COUNT(b.id),
            COALESCE(SUM(p.amount), 0.0)
        FROM Venue v
        LEFT JOIN Booking b ON b.venue.id = v.id
        LEFT JOIN Payment p ON p.booking.id = b.id
        WHERE v.owner.userId = :ownerId
        AND b.startTime BETWEEN :startDate AND :endDate
        AND p.status = 'completed'
        GROUP BY v.id, v.name
        ORDER BY COALESCE(SUM(p.amount), 0.0) DESC
    """)
    List<Object[]> getTopVenues(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Get sport popularity
     */
    @Query("""
        SELECT 
            b.sportType,
            COUNT(b.id),
            (COUNT(b.id) * 100.0 / (
                SELECT COUNT(b2.id) 
                FROM Booking b2 
                WHERE b2.venue.owner.userId = :ownerId
                AND b2.startTime BETWEEN :startDate AND :endDate
            ))
        FROM Booking b
        WHERE b.venue.owner.userId = :ownerId
        AND b.sportType IS NOT NULL
        AND b.startTime BETWEEN :startDate AND :endDate
        GROUP BY b.sportType
        ORDER BY COUNT(b.id) DESC
    """)
    List<Object[]> getSportPopularity(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Get peak booking times (by hour)
     */
    @Query("""
        SELECT 
            HOUR(b.startTime),
            COUNT(b.id)
        FROM Booking b
        WHERE b.venue.owner.userId = :ownerId
        AND b.startTime BETWEEN :startDate AND :endDate
        GROUP BY HOUR(b.startTime)
        ORDER BY HOUR(b.startTime)
    """)
    List<Object[]> getPeakBookingTimes(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Count unique active customers
     */
    @Query("""
        SELECT COUNT(DISTINCT b.player.userId)
        FROM Booking b
        WHERE b.venue.owner.userId = :ownerId
        AND b.startTime BETWEEN :startDate AND :endDate
        AND b.status IN ('CONFIRMED', 'PENDING')
    """)
    Long countActiveCustomers(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Count total bookings for period
     */
    @Query("""
        SELECT COUNT(b.id)
        FROM Booking b
        WHERE b.venue.owner.userId = :ownerId
        AND b.startTime BETWEEN :startDate AND :endDate
    """)
    Long countTotalBookings(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}

