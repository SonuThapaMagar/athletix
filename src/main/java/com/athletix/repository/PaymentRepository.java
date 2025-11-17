package com.athletix.repository;

import com.athletix.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double sumSuccessfulPayments();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'SUCCESS'")
    Long countSuccessfulPayments();

    @Query("SELECT DATE(p.createdAt), SUM(p.amount), COUNT(p) " +
            "FROM Payment p WHERE p.status = 'SUCCESS' " +
            "AND p.createdAt BETWEEN :start AND :end " +
            "GROUP BY DATE(p.createdAt)")
    List<Object[]> getRevenueReport(LocalDate start, LocalDate end);
}
