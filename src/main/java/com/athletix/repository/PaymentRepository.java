package com.athletix.repository;

import com.athletix.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    // === Old/unused methods (you can remove them if you want) ===
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double sumSuccessfulPayments();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'SUCCESS'")
    Long countSuccessfulPayments();

    @Query("SELECT DATE(p.createdAt), SUM(p.amount), COUNT(p) " +
            "FROM Payment p WHERE p.status = 'SUCCESS' " +
            "AND p.createdAt BETWEEN :start AND :end " +
            "GROUP BY DATE(p.createdAt)")
    List<Object[]> getRevenueReport(LocalDate start, LocalDate end);

    // Find payments by venue owner
    @Query("""
        SELECT p FROM Payment p 
        WHERE p.booking.venue.owner.userId = :ownerId
        ORDER BY p.createdAt DESC
    """)
    Page<Payment> findByVenueOwner(@Param("ownerId") Long ownerId, Pageable pageable);

    // Find payments by status for a venue owner
    @Query("""
        SELECT p FROM Payment p 
        WHERE p.booking.venue.owner.userId = :ownerId 
        AND LOWER(p.status) = LOWER(:status)
        ORDER BY p.createdAt DESC
    """)
    Page<Payment> findByVenueOwnerAndStatus(
            @Param("ownerId") Long ownerId,
            @Param("status") String status,
            Pageable pageable
    );

    // === FIXED: Revenue based on booking.paid = true (reliable) ===
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        AND p.booking.paid = true
    """)
    Double calculateTotalRevenue(@Param("ownerId") Long ownerId);

    // === FIXED: This month = bookings STARTING this month + paid ===
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        AND p.booking.paid = true
        AND YEAR(p.booking.startTime) = YEAR(:startOfMonth)
        AND MONTH(p.booking.startTime) = MONTH(:startOfMonth)
    """)
    Double calculateMonthlyRevenue(
            @Param("ownerId") Long ownerId,
            @Param("startOfMonth") LocalDateTime startOfMonth
    );

    // === FIXED: Pending = unpaid + PENDING bookings ===
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        AND p.booking.paid = false
        AND p.booking.status = 'PENDING'
    """)
    Double calculatePendingAmount(@Param("ownerId") Long ownerId);

    // Count total transactions
    @Query("""
        SELECT COUNT(p) FROM Payment p 
        WHERE p.booking.venue.owner.userId = :ownerId
    """)
    Long countTotalTransactions(@Param("ownerId") Long ownerId);
    Optional<Payment> findByBooking_Id(Long bookingId);

    // Calculate total revenue for venue owner (all time)
    @Query("""
    SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p
    WHERE p.booking.venue.owner.userId = :ownerId
    AND LOWER(p.status) = 'completed'
""")
    Double calculateTotalRevenueForOwner(@Param("ownerId") Long ownerId);

    @Query("""
    SELECT COALESCE(SUM(p.amount), 0.0)
    FROM Payment p
    WHERE p.booking.venue.owner.userId = :ownerId
    AND p.status = 'completed'
    AND p.createdAt BETWEEN :startDate AND :endDate
""")
    Double calculateTotalRevenueForPeriod(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

}
