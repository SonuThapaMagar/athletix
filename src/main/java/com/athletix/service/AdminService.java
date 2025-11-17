package com.athletix.service;

import com.athletix.dto.admin.*;
import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import com.athletix.entity.User;
import com.athletix.entity.Venue;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.PaymentRepository;
import com.athletix.repository.UserRepository;
import com.athletix.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final VenueRepository venueRepo;
    private final BookingRepository bookingRepo;
    private final PaymentRepository paymentRepo;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    // 1. Users
    public List<UserDto> getAllUsers() {
        return userRepo.findAll().stream()
                .map(u -> new UserDto(u.getUserId(), u.getName(), u.getEmail(), u.getRole().name(), u.isActive()))
                .toList();
    }

    public void suspendUser(Long id) {
        User user = userRepo.findById(id).orElseThrow();
        user.setActive(false);
        userRepo.save(user);
    }

    public void activateUser(Long id) {
        User user = userRepo.findById(id).orElseThrow();
        user.setActive(true);
        userRepo.save(user);
    }

    // 2. Venues
    public List<VenueDto> getAllVenues() {
        return venueRepo.findAll().stream()
                .map(v -> new VenueDto(v.getId(), v.getName(), v.getOwner().getName(), v.getStatus(), v.getPricePerHour()))
                .toList();
    }

    public void approveVenue(Long id) {
        Venue v = venueRepo.findById(id).orElseThrow();
        v.setStatus("APPROVED");
        venueRepo.save(v);
    }

    public void rejectVenue(Long id) {
        Venue v = venueRepo.findById(id).orElseThrow();
        v.setStatus("REJECTED");
        venueRepo.save(v);
    }

    // 3. Bookings
    public List<BookingDto> getAllBookings() {
        return bookingRepo.findAll().stream()
                .map(b -> new BookingDto(
                        b.getId(),
                        b.getPlayer().getName(),
                        b.getSlot().getVenue().getName(),
                        b.getSlot().getStartTime() + " - " + b.getSlot().getEndTime(),
                        b.getAmount(),
                        b.getStatus().name()
                ))
                .toList();
    }

    public void cancelBooking(Long id) {
        Booking b = bookingRepo.findById(id).orElseThrow();
        b.setStatus(BookingStatus.CANCELLED);
        // Refund logic here
        bookingRepo.save(b);
    }

    // 4. Analytics
    public AnalyticsDto getAnalytics() {
        return new AnalyticsDto(
                userRepository.count(),
                venueRepository.count(),
                bookingRepository.count(),
                paymentRepository.sumSuccessfulPayments() != null ? paymentRepo.sumSuccessfulPayments() : 0.0
        );
    }

    public List<RevenueReportDto> getRevenueReport(String start, String end) {
        // Use @Query with native SQL or Criteria
        // Example: group by date
        return List.of(
                new RevenueReportDto("2025-11-10", 15000.0, 10L),
                new RevenueReportDto("2025-11-11", 18000.0, 12L)
        );
    }

    // 5. Broadcast
    public void broadcast(String message) {
        // Push to Firebase, WebSocket, or save in DB
        System.out.println("BROADCAST: " + message);
    }
}