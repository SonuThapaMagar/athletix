// service/VenueOwnerAnalyticsService.java
package com.athletix.service;

import com.athletix.dto.analytics.*;
import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import com.athletix.entity.User;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.PaymentRepository;
import com.athletix.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueOwnerAnalyticsService {

    private final AuthService authService;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final VenueRepository venueRepository;

    /**
     * Get complete analytics data
     */
    public AnalyticsData getAnalyticsData(String authHeader, AnalyticsFilters filters) {
        AnalyticsStats stats = getStats(authHeader, filters);
        List<RevenueDataPoint> revenueData = getRevenueData(authHeader, filters);
        List<TopVenue> topVenues = getTopVenues(authHeader, filters);
        List<SportPopularity> sportPopularity = getSportPopularity(authHeader, filters);
        List<TimeSlot> peakTimes = getPeakBookingTimes(authHeader, filters);

        return new AnalyticsData(stats, revenueData, topVenues, sportPopularity, peakTimes);
    }

    /**
     * Get analytics statistics
     */
    public AnalyticsStats getStats(String authHeader, AnalyticsFilters filters) {
        User owner = authService.validateVenueOwner(authHeader);
        Long ownerId = owner.getUserId();

        // Get all bookings for the owner
        List<Booking> bookings = bookingRepository.findByVenue_Owner_UserId(ownerId).stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.toList());

        // Calculate stats
        Long totalBookings = (long) bookings.size();
        Double totalRevenue = bookings.stream()
                .mapToDouble(Booking::getAmount)
                .sum();

        // Count unique customers
        Long activeCustomers = bookings.stream()
                .map(b -> b.getPlayer().getUserId())
                .distinct()
                .count();

        // For now, use dummy rating data (implement rating system later)
        Double averageRating = 4.5;

        return new AnalyticsStats(
                totalRevenue,
                totalBookings,
                activeCustomers,
                averageRating,
                12.5, // dummy revenueChange
                8.3,  // dummy bookingsChange
                5.2,  // dummy customersChange
                0.3   // dummy ratingChange
        );
    }

    /**
     * Get revenue data for chart
     */
    public List<RevenueDataPoint> getRevenueData(String authHeader, AnalyticsFilters filters) {
        User owner = authService.validateVenueOwner(authHeader);

        List<Booking> bookings = bookingRepository.findByVenue_Owner_UserId(owner.getUserId()).stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.toList());

        // Group by month
        Map<YearMonth, Double> monthlyRevenue = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> YearMonth.from(b.getCreatedAt()),
                        Collectors.summingDouble(Booking::getAmount)
                ));

        // Get last 6 months
        List<RevenueDataPoint> result = new ArrayList<>();
        YearMonth current = YearMonth.now();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            Double revenue = monthlyRevenue.getOrDefault(month, 0.0);

            result.add(new RevenueDataPoint(
                    month.format(DateTimeFormatter.ofPattern("MMM")),
                    revenue,
                    month.getYear()
            ));
        }

        return result;
    }

    /**
     * Get top performing venues
     */
    public List<TopVenue> getTopVenues(String authHeader, AnalyticsFilters filters) {
        User owner = authService.validateVenueOwner(authHeader);

        List<Booking> bookings = bookingRepository.findByVenue_Owner_UserId(owner.getUserId()).stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.toList());

        // Group by venue
        Map<Long, List<Booking>> venueBookings = bookings.stream()
                .collect(Collectors.groupingBy(b -> b.getVenue().getId()));

        return venueBookings.entrySet().stream()
                .map(entry -> {
                    Long venueId = entry.getKey();
                    List<Booking> vBookings = entry.getValue();
                    String venueName = vBookings.get(0).getVenue().getName();
                    Long bookingCount = (long) vBookings.size();
                    Double revenue = vBookings.stream().mapToDouble(Booking::getAmount).sum();

                    return new TopVenue(venueId, venueName, bookingCount, revenue, 10.5);
                })
                .sorted((a, b) -> Double.compare(b.revenue(), a.revenue()))
                .limit(5)
                .collect(Collectors.toList());
    }

    /**
     * Get sport popularity data
     */
    public List<SportPopularity> getSportPopularity(String authHeader, AnalyticsFilters filters) {
        User owner = authService.validateVenueOwner(authHeader);

        List<Booking> bookings = bookingRepository.findByVenue_Owner_UserId(owner.getUserId()).stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED && b.getSportType() != null)
                .collect(Collectors.toList());

        long totalBookings = bookings.size();
        if (totalBookings == 0) return List.of();

        // Group by sport
        Map<String, Long> sportCounts = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::getSportType,
                        Collectors.counting()
                ));

        return sportCounts.entrySet().stream()
                .map(entry -> {
                    String sport = entry.getKey();
                    Long count = entry.getValue();
                    Double percentage = (count * 100.0) / totalBookings;

                    return new SportPopularity(sport, percentage, count);
                })
                .sorted((a, b) -> Double.compare(b.percentage(), a.percentage()))
                .collect(Collectors.toList());
    }

    /**
     * Get peak booking times
     */
    public List<TimeSlot> getPeakBookingTimes(String authHeader, AnalyticsFilters filters) {
        User owner = authService.validateVenueOwner(authHeader);

        List<Booking> bookings = bookingRepository.findByVenue_Owner_UserId(owner.getUserId()).stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.toList());

        // Group by hour
        Map<Integer, Long> hourCounts = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getStartTime().getHour(),
                        Collectors.counting()
                ));

        return hourCounts.entrySet().stream()
                .map(entry -> {
                    int hour = entry.getKey();
                    String timeRange = String.format("%02d:00 - %02d:00", hour, hour + 2);
                    return new TimeSlot(timeRange, entry.getValue());
                })
                .sorted((a, b) -> Long.compare(b.bookings(), a.bookings()))
                .limit(6)
                .collect(Collectors.toList());
    }
}