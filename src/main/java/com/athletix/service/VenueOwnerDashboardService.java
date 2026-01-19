package com.athletix.service;

import com.athletix.dto.dashboard.DashboardData;
import com.athletix.dto.dashboard.DashboardStats;
import com.athletix.dto.dashboard.RecentBooking;
import com.athletix.entity.Booking;
import com.athletix.entity.User;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.PaymentRepository;
import com.athletix.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueOwnerDashboardService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final VenueRepository venueRepository;
    private final AuthService authService;

    /**
     * Get complete dashboard data (stats + recent bookings)
     */
    public DashboardData getDashboardData(String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);

        DashboardStats stats = calculateStats(owner.getUserId());
        List<RecentBooking> recentBookings = getRecentBookings(owner.getUserId(), 5);

        return new DashboardData(stats, recentBookings);
    }

    /**
     * Get dashboard statistics only
     */
    public DashboardStats getStats(String authHeader) {
        User owner = authService.validateVenueOwner(authHeader);
        return calculateStats(owner.getUserId());
    }

    /**
     * Get recent bookings only
     */
    public List<RecentBooking> getRecentBookingsOnly(String authHeader, Integer limit) {
        User owner = authService.validateVenueOwner(authHeader);
        return getRecentBookings(owner.getUserId(), limit != null ? limit : 5);
    }

    /**
     * Calculate dashboard statistics
     */
    private DashboardStats calculateStats(Long ownerId) {
        // Total revenue (all completed payments)
        Double totalRevenue = paymentRepository.calculateTotalRevenueForOwner(ownerId);
        if (totalRevenue == null) totalRevenue = 0.0;

        // Active bookings (PENDING or CONFIRMED)
        Long activeBookingsCount = bookingRepository.countActiveBookings(ownerId);
        Integer activeBookings = activeBookingsCount != null ? activeBookingsCount.intValue() : 0;

        // Total venues
        Long venueCount = venueRepository.countByOwner_UserId(ownerId);
        Integer totalVenues = venueCount != null ? venueCount.intValue() : 0;

        // Customer rating (placeholder - implement based on your review system)
        Double customerRating = 4.5; // TODO: Calculate from actual reviews

        // Calculate changes (placeholder - implement based on time period comparison)
        Double revenueChange = 0.0; // TODO: Compare with previous period
        Double bookingsChange = 0.0; // TODO: Compare with previous period
        Integer venuesChange = 0; // TODO: Compare with previous period
        Double ratingChange = 0.0; // TODO: Compare with previous period

        return new DashboardStats(
                totalRevenue,
                activeBookings,
                totalVenues,
                customerRating,
                revenueChange,
                bookingsChange,
                venuesChange,
                ratingChange
        );
    }

    /**
     * Get recent bookings for owner
     */
    private List<RecentBooking> getRecentBookings(Long ownerId, int limit) {
        List<Booking> bookings = bookingRepository.findRecentBookingsByOwner(
                ownerId,
                PageRequest.of(0, limit)
        );

        return bookings.stream()
                .map(this::toRecentBookingDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert Booking entity to RecentBooking DTO
     */
    private RecentBooking toRecentBookingDTO(Booking booking) {
        String venueImage = null;
        List<String> images = booking.getVenue().getImages();
        if (images != null && !images.isEmpty()) {
            String publicId = images.get(0);
             }
        return new RecentBooking(
                booking.getId(),
                booking.getVenue().getId(),
                booking.getVenue().getName(),
                booking.getPlayer().getUserId(),
                booking.getPlayer().getName(),
                booking.getSportType() != null ? booking.getSportType() : "Sports",
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus(),
                booking.getAmount(),
                booking.isPaid(),
                booking.getCreatedAt(),
                venueImage
        );
    }
}