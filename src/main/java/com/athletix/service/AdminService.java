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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final VenueRepository venueRepo;
    private final BookingRepository bookingRepo;
    private final PaymentRepository paymentRepo;

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
                .map(v -> new VenueDto(v.getId(), v.getName(), v.getOwner().getName(),v.getPricePerHour()))
                .toList();
    }
    // ---------------------------------------------
    // 1. GET ALL PENDING VENUES
    // ---------------------------------------------
//    public List<PendingVenueResponse> getPendingVenues() {
////        List<Venue> venues = venueRepo.findByStatus(VenueStatus.PENDING);
//
//        return venues.stream()
//                .map(v -> new PendingVenueResponse(
//                        v.getId(),
//                        v.getName(),
//                        v.getLocation(),
//                        v.getOwner().getName()))
//                .collect(Collectors.toList());
//    }
//    public PendingVenueResponse approveVenue(Long venueId) {
//        Venue venue = venueRepo.findById(venueId)
//                .orElseThrow(() -> new RuntimeException("Venue not found"));
//
//        venue.setStatus(VenueStatus.APPROVED);
//        venue.setVerified(true);
//        venueRepo.save(venue);
//
//        return new PendingVenueResponse(
//                venue.getId(),
//                venue.getName(),
//                venue.getLocation(),
//                venue.getOwner().getName()
//        );
//    }


    // ---------------------------------------------
    // 3. REJECT VENUE
    // ---------------------------------------------
//    public String rejectVenue(Long venueId) {
//        Venue venue = venueRepo.findById(venueId)
//                .orElseThrow(() -> new RuntimeException("Venue not found"));
//
//        venue.setStatus(VenueStatus.REJECTED);
//        venue.setVerified(false);
//        venueRepo.save(venue);
//
//        return "Venue rejected successfully";
//    }

    // ---------------------------------------------
    // 4. DASHBOARD SUMMARY
    // ---------------------------------------------
//    public AdminDashboardResponse getDashboardSummary() {
//
//        long totalUsers = userRepo.count();
//        long totalVenues = venueRepo.count();
//        long pendingVenues = venueRepo.countByStatus(VenueStatus.PENDING);
//        long approvedVenues = venueRepo.countByStatus(VenueStatus.APPROVED);
//        long totalBookings = bookingRepo.count();
//        long totalPayments = paymentRepo.count();
//
//        double totalRevenue = paymentRepo.findAll().stream()
//                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
//                .mapToDouble(Payment::getAmount)
//                .sum();
//
//        return new AdminDashboardResponse(
//                totalUsers,
//                totalVenues,
//                pendingVenues,
//                approvedVenues,
//                totalBookings,
//                totalPayments,
//                totalRevenue
//        );
//    }
//
//    // ---------------------------------------------
//    // 5. MONTHLY REVENUE CHART
//    // ---------------------------------------------
//    public double getMonthlyRevenue(int year, int month) {
//        LocalDate start = YearMonth.of(year, month).atDay(1);
//        LocalDate end = start.plusMonths(1);
//
//        return paymentRepo.findByCreatedAtBetween(start, end).stream()
//                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
//                .mapToDouble(Payment::getAmount)
//                .sum();
//    }
//
//    // ---------------------------------------------
//    // 6. GET ALL USERS (SUMMARY)
//    // ---------------------------------------------
//    public List<UserSummary> getUserSummaries() {
//        return userRepo.findAll().stream()
//                .map(user -> new UserSummary(
//                        user.getId(),
//                        user.getName(),
//                        user.getEmail(),
//                        user.getPhone(),
//                        user.getRole().name()
//                ))
//                .collect(Collectors.toList());
//    }

//    public void rejectVenue(Long id) {
//        Venue v = venueRepo.findById(id).orElseThrow();
//        v.setStatus("REJECTED");
//        venueRepo.save(v);
//    }

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
                userRepo.count(),
                venueRepo.count(),
                bookingRepo.count(),
                paymentRepo.sumSuccessfulPayments() != null ? paymentRepo.sumSuccessfulPayments() : 0.0
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