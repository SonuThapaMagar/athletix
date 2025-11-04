//package com.athletix.repository;
//
//import com.athletix.entity.Booking;
//import com.athletix.entity.BookingStatus;
//import com.athletix.entity.Venue;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//public interface BookingRepository extends JpaRepository<Booking, Long> {
//    List<Booking> findByVenueAndStartTimeBetween(Venue venue, LocalDateTime start, LocalDateTime end);
//    List<Booking> findByPlayer_UserId(Long playerId);
//    List<Booking> findByVenue_Owner_UserId(Long ownerId);
//    List<Booking> findByVenueAndStatus(Venue venue, BookingStatus status);
//}