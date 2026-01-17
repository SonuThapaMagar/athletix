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
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // =========================================================
    // BASIC FETCH
    // =========================================================
    Optional<Payment> findByBooking_Id(Long bookingId);

    // =========================================================
    // VENUE OWNER – PAYMENTS LIST
    // =========================================================
    @Query("""
        SELECT p FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        ORDER BY p.createdAt DESC
    """)
    Page<Payment> findByVenueOwner(
            @Param("ownerId") Long ownerId,
            Pageable pageable
    );

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

    // =========================================================
    // BASIC SUCCESS PAYMENTS
    // =========================================================
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double sumSuccessfulPayments();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'SUCCESS'")
    Long countSuccessfulPayments();

    @Query("""
        SELECT DATE(p.createdAt), SUM(p.amount), COUNT(p)
        FROM Payment p
        WHERE p.status = 'SUCCESS'
        AND p.createdAt BETWEEN :start AND :end
        GROUP BY DATE(p.createdAt)
    """)
    List<Object[]> getRevenueReport(@Param("start") LocalDate start, @Param("end") LocalDate end);

    // =========================================================
    // REVENUE CALCULATIONS
    // =========================================================

    // Total revenue (paid bookings)
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0.0)
        FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        AND p.booking.paid = true
    """)
    Double calculateTotalRevenue(@Param("ownerId") Long ownerId);

    // Monthly revenue (requires startOfMonth)
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0.0)
        FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        AND p.booking.paid = true
        AND YEAR(p.booking.startTime) = YEAR(:startOfMonth)
        AND MONTH(p.booking.startTime) = MONTH(:startOfMonth)
    """)
    Double calculateMonthlyRevenue(
            @Param("ownerId") Long ownerId,
            @Param("startOfMonth") LocalDateTime startOfMonth
    );

    // Total revenue for owner (status = completed)
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0.0)
        FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        AND LOWER(p.status) = 'completed'
    """)
    Double calculateTotalRevenueForOwner(@Param("ownerId") Long ownerId);

    // Revenue for custom period
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

    // =========================================================
    // PENDING PAYMENTS
    // =========================================================
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0.0)
        FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
        AND p.booking.paid = false
        AND p.booking.status = 'PENDING'
    """)
    Double calculatePendingAmount(@Param("ownerId") Long ownerId);

    // =========================================================
    // TOTAL TRANSACTIONS
    // =========================================================
    @Query("""
        SELECT COUNT(p)
        FROM Payment p
        WHERE p.booking.venue.owner.userId = :ownerId
    """)
    Long countTotalTransactions(@Param("ownerId") Long ownerId);

}
