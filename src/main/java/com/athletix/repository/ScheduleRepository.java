package com.athletix.repository;

import com.athletix.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Find schedule for specific venue and date
    Optional<Schedule> findByVenue_IdAndDate(Long venueId, LocalDate date);

    // Find all schedules for a venue
    List<Schedule> findByVenue_IdOrderByDateAsc(Long venueId);

    // Find schedules for a venue in date range
    @Query("SELECT s FROM Schedule s WHERE s.venue.id = :venueId " +
            "AND s.date BETWEEN :startDate AND :endDate " +
            "ORDER BY s.date ASC")
    List<Schedule> findByVenueAndDateRange(
            @Param("venueId") Long venueId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Find all schedules owned by a specific user
    List<Schedule> findByVenue_Owner_UserId(Long ownerId);

    // Find blocked schedules for a venue
    List<Schedule> findByVenue_IdAndIsBlockedTrue(Long venueId);
}