package com.athletix.service;

import com.athletix.dto.admin.*;
import com.athletix.dto.analytics.RevenueDataPoint;
import com.athletix.dto.analytics.SportPopularity;
import com.athletix.dto.analytics.TimeSlot;
import com.athletix.dto.analytics.TopVenue;
import com.athletix.dto.pagination.Pagination;
import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.entity.*;
import com.athletix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    // ==================== DASHBOARD ====================

    public AdminDashboardData getDashboardData() {
        AdminDashboardStats stats = getDashboardStats();
        List<AdminRecentActivity> activities = getRecentActivities(10);
        return new AdminDashboardData(stats, activities);
    }

    public AdminDashboardStats getDashboardStats() {
        Long totalUsers = userRepository.count();
        Long activeVenues = venueRepository.count();
        Long totalBookings = bookingRepository.count();

        Double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        return new AdminDashboardStats(
                totalUsers,
                activeVenues,
                totalRevenue,
                totalBookings,
                5.2,  // usersChange - mock
                3.1,  // venuesChange - mock
                12.5, // revenueChange - mock
                8.3   // bookingsChange - mock
        );
    }

    public List<AdminRecentActivity> getRecentActivities(Integer limit) {
        int resultLimit = (limit != null && limit > 0) ? limit : 10;

        List<Booking> recentBookings = bookingRepository.findAll().stream()
                .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
                .limit(resultLimit)
                .toList();

        return recentBookings.stream()
                .map(booking -> new AdminRecentActivity(
                        booking.getId(),
                        "New booking created for " + booking.getVenue().getName(),
                        booking.getPlayer().getName(),
                        booking.getCreatedAt().toString(),
                        "booking",
                        booking.getId(),
                        "Booking"
                ))
                .collect(Collectors.toList());
    }

    // ==================== USER MANAGEMENT ====================

    public PaginationResponse<AdminUserDto> getAllUsers(String role, String status, String search, Integer page, Integer perPage) {
        // Default pagination values
        int pageIndex = Math.max((page != null ? page : 1) - 1, 0);
        int size = (perPage != null && perPage > 0) ? perPage : 10;

        List<User> users = userRepository.findAll();

        // Apply filters
        if (role != null && !role.equals("all")) {
            users = users.stream()
                    .filter(u -> u.getRole().name().equals(role))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.equals("all")) {
            boolean isActive = "ACTIVE".equals(status);
            users = users.stream()
                    .filter(u -> u.isActive() == isActive)
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            users = users.stream()
                    .filter(u -> u.getName().toLowerCase().contains(searchLower) ||
                            u.getEmail().toLowerCase().contains(searchLower))
                    .collect(Collectors.toList());
        }

        // Calculate pagination
        long totalElements = users.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = pageIndex * size;
        int endIndex = Math.min(startIndex + size, users.size());

        // Get paginated subset
        List<AdminUserDto> paginatedUsers = users.subList(startIndex, endIndex).stream()
                .map(u -> new AdminUserDto(
                        u.getUserId(),
                        u.getName(),
                        u.getEmail(),
                        u.getPhone(),
                        u.getLocation(),
                        u.getRole().name(),
                        u.isActive() ? "ACTIVE" : "INACTIVE",
                        u.isActive(),
                        u.getCreatedAt().toString(),
                        u.getUpdatedAt() != null ? u.getUpdatedAt().toString() : null,
                        null
                ))
                .collect(Collectors.toList());

        Pagination pagination = new Pagination(
                page != null ? page : 1,
                size,
                totalElements,
                totalPages
        );

        return new PaginationResponse<>(paginatedUsers, pagination);
    }

    public AdminUserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return new AdminUserDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getLocation(),
                user.getRole().name(),
                user.isActive() ? "ACTIVE" : "INACTIVE",
                user.isActive(),
                user.getCreatedAt().toString(),
                user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null,
                null
        );
    }

    public AdminUserDto updateUser(Long id, Map<String, Object> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("phone")) {
            user.setPhone((String) updates.get("phone"));
        }
        if (updates.containsKey("location")) {
            user.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("active")) {
            user.setActive((Boolean) updates.get("active"));
        }

        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        return new AdminUserDto(
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getLocation(),
                savedUser.getRole().name(),
                savedUser.isActive() ? "ACTIVE" : "INACTIVE",
                savedUser.isActive(),
                savedUser.getCreatedAt().toString(),
                savedUser.getUpdatedAt() != null ? savedUser.getUpdatedAt().toString() : null,
                null
        );
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public void suspendUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // ==================== VENUE MANAGEMENT ====================

    public PaginationResponse<AdminVenueDto> getAllVenues(String status, String search, Integer page, Integer perPage) {
        // Default pagination values
        int pageIndex = Math.max((page != null ? page : 1) - 1, 0);
        int size = (perPage != null && perPage > 0) ? perPage : 10;

        List<Venue> venues = venueRepository.findAll();

        // Apply search filter
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            venues = venues.stream()
                    .filter(v -> v.getName().toLowerCase().contains(searchLower) ||
                            v.getLocation().toLowerCase().contains(searchLower))
                    .collect(Collectors.toList());
        }

        // Calculate pagination
        long totalElements = venues.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = pageIndex * size;
        int endIndex = Math.min(startIndex + size, venues.size());

        // Get paginated subset
        List<AdminVenueDto> paginatedVenues = venues.subList(startIndex, endIndex).stream()
                .map(v -> new AdminVenueDto(
                        v.getId(),
                        v.getName(),
                        v.getOwner().getName(),
                        v.getOwner().getUserId(),
                        "ACTIVE",
                        v.getPricePerHour(),
                        v.getLocation(),
                        v.getSportTypes() != null && !v.getSportTypes().isEmpty()
                                ? String.join(", ", v.getSportTypes())
                                : "N/A",
                        v.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());

        Pagination pagination = new Pagination(
                page != null ? page : 1,
                size,
                totalElements,
                totalPages
        );

        return new PaginationResponse<>(paginatedVenues, pagination);
    }

    public AdminVenueDto getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));

        return new AdminVenueDto(
                venue.getId(),
                venue.getName(),
                venue.getOwner().getName(),
                venue.getOwner().getUserId(),
                "ACTIVE",
                venue.getPricePerHour(),
                venue.getLocation(),
                venue.getSportTypes() != null && !venue.getSportTypes().isEmpty()
                        ? String.join(", ", venue.getSportTypes())
                        : "N/A",
                venue.getCreatedAt().toString()
        );
    }

    public AdminVenueDto updateVenue(Long id, Map<String, Object> updates) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));

        if (updates.containsKey("name")) {
            venue.setName((String) updates.get("name"));
        }
        if (updates.containsKey("location")) {
            venue.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("pricePerHour")) {
            venue.setPricePerHour(((Number) updates.get("pricePerHour")).doubleValue());
        }

        Venue savedVenue = venueRepository.save(venue);

        return new AdminVenueDto(
                savedVenue.getId(),
                savedVenue.getName(),
                savedVenue.getOwner().getName(),
                savedVenue.getOwner().getUserId(),
                "ACTIVE",
                savedVenue.getPricePerHour(),
                savedVenue.getLocation(),
                savedVenue.getSportTypes() != null && !savedVenue.getSportTypes().isEmpty()
                        ? String.join(", ", savedVenue.getSportTypes())
                        : "N/A",
                savedVenue.getCreatedAt().toString()
        );
    }

    public void deleteVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        venueRepository.delete(venue);
    }

    // ==================== BOOKING MANAGEMENT ====================

    public PaginationResponse<AdminBookingDto> getAllBookings(String status, Long venueId, Long playerId,
                                                              String startDate, String endDate, String search,
                                                              Integer page, Integer perPage) {
        // Default pagination values
        int pageIndex = Math.max((page != null ? page : 1) - 1, 0);
        int size = (perPage != null && perPage > 0) ? perPage : 10;

        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingRepository.findAll(pageable);

        // Filter in-memory (or create custom repository methods for better performance)
        List<Booking> bookings = bookingPage.getContent();

        if (status != null && !status.equals("all")) {
            bookings = bookings.stream()
                    .filter(b -> b.getStatus().name().equals(status))
                    .collect(Collectors.toList());
        }

        if (venueId != null) {
            bookings = bookings.stream()
                    .filter(b -> b.getVenue().getId().equals(venueId))
                    .collect(Collectors.toList());
        }

        if (playerId != null) {
            bookings = bookings.stream()
                    .filter(b -> b.getPlayer().getUserId().equals(playerId))
                    .collect(Collectors.toList());
        }

        List<AdminBookingDto> bookingDtos = bookings.stream()
                .map(b -> new AdminBookingDto(
                        b.getId(),
                        b.getVenue().getId(),
                        b.getVenue().getName(),
                        b.getPlayer().getUserId(),
                        b.getPlayer().getName(),
                        b.getPlayer().getEmail(),
                        b.getSportType() != null ? b.getSportType() : "N/A",
                        b.getStartTime().toString(),
                        b.getEndTime().toString(),
                        b.getStatus().name(),
                        b.getAmount(),
                        b.isPaid(),
                        b.getCreatedAt().toString(),
                        b.getPaymentRefId() != null ? b.getPaymentRefId() : ""
                ))
                .collect(Collectors.toList());

        Pagination pagination = new Pagination(
                page != null ? page : 1,
                size,
                bookingPage.getTotalElements(),
                bookingPage.getTotalPages()
        );

        return new PaginationResponse<>(bookingDtos, pagination);
    }

    public AdminBookingDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        return new AdminBookingDto(
                booking.getId(),
                booking.getVenue().getId(),
                booking.getVenue().getName(),
                booking.getPlayer().getUserId(),
                booking.getPlayer().getName(),
                booking.getPlayer().getEmail(),
                booking.getSportType() != null ? booking.getSportType() : "N/A",
                booking.getStartTime().toString(),
                booking.getEndTime().toString(),
                booking.getStatus().name(),
                booking.getAmount(),
                booking.isPaid(),
                booking.getCreatedAt().toString(),
                booking.getPaymentRefId() != null ? booking.getPaymentRefId() : ""
        );
    }

    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    // ==================== PAYMENT MANAGEMENT ====================

    public List<AdminPaymentDto> getAllPayments(String status, Long venueId, String startDate,
                                                String endDate, String paymentMethod, String search,
                                                Integer page, Integer perPage) {
        List<Payment> payments = paymentRepository.findAll();

        if (status != null && !status.equals("all")) {
            payments = payments.stream()
                    .filter(p -> p.getStatus().equals(status))
                    .collect(Collectors.toList());
        }

        if (venueId != null) {
            payments = payments.stream()
                    .filter(p -> p.getBooking().getVenue().getId().equals(venueId))
                    .collect(Collectors.toList());
        }

        return payments.stream()
                .map(p -> new AdminPaymentDto(
                        p.getId(),
                        p.getBooking().getId(),
                        p.getBooking().getPaymentRefId(),
                        p.getBooking().getVenue().getId(),
                        p.getBooking().getVenue().getName(),
                        p.getBooking().getPlayer().getName(),
                        p.getBooking().getPlayer().getEmail(),
                        p.getBooking().getStartTime().toString(),
                        p.getAmount(),
                        "ESEWA",  // You don't have paymentMethod in entity
                        p.getStatus(),
                        p.getRefId(),
                        p.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());
    }

    public AdminPaymentSummary getPaymentSummary(String startDate, String endDate) {
        List<Payment> payments = paymentRepository.findAll();

        double totalRevenue = payments.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        long totalTransactions = payments.size();
        long completedPayments = payments.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .count();
        long pendingPayments = payments.stream()
                .filter(p -> "PENDING".equals(p.getStatus()))
                .count();
        long failedPayments = payments.stream()
                .filter(p -> "FAILED".equals(p.getStatus()))
                .count();

        return new AdminPaymentSummary(
                totalRevenue,
                totalTransactions,
                completedPayments,
                pendingPayments,
                failedPayments,
                0L
        );
    }

    public byte[] exportPayments(String status, Long venueId, String startDate, String endDate, String format) {
        return new byte[0];
    }

    // ==================== ANALYTICS ====================

    public AdminAnalyticsData getAnalyticsData(String startDate, String endDate, Long venueId) {
        AdminAnalyticsStats stats = getAnalyticsStats(startDate, endDate);
        List<AdminRevenueDataPoint> revenueData = calculateMonthlyRevenue();
        List<AdminTopVenue> topVenues = getTopPerformingVenues(5);
        List<AdminSportPopularity> sportPopularity = calculateSportPopularity();
        List<AdminTimeSlot> peakBookingTimes = calculatePeakBookingTimes();

        return new AdminAnalyticsData(stats, revenueData, topVenues, sportPopularity, peakBookingTimes);
    }

    public AdminAnalyticsStats getAnalyticsStats(String startDate, String endDate) {
        Long totalBookings = bookingRepository.count();
        Long activeUsers = userRepository.count();
        Long totalVenues = venueRepository.count();

        Double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        // Calculate changes (mock for now - you can implement actual comparison logic)
        Double revenueChange = 12.5;
        Double bookingsChange = 8.3;
        Double usersChange = 5.2;
        Double venuesChange = 3.1;

        return new AdminAnalyticsStats(
                totalRevenue,
                totalBookings,
                activeUsers,
                totalVenues,
                revenueChange,
                bookingsChange,
                usersChange,
                venuesChange
        );
    }

    private List<AdminRevenueDataPoint> calculateMonthlyRevenue() {
        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .collect(Collectors.toList());

        // Group payments by month
        Map<String, Double> monthlyRevenue = new LinkedHashMap<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");

        payments.forEach(payment -> {
            String month = payment.getCreatedAt().format(monthFormatter);
            int year = payment.getCreatedAt().getYear();
            String key = month + "-" + year;

            monthlyRevenue.merge(key, payment.getAmount(), Double::sum);
        });

        // Convert to list of AdminRevenueDataPoint
        List<AdminRevenueDataPoint> result = new ArrayList<>();
        monthlyRevenue.forEach((key, revenue) -> {
            String[] parts = key.split("-");
            String month = parts[0];
            Integer year = Integer.parseInt(parts[1]);
            result.add(new AdminRevenueDataPoint(month, revenue, year));
        });

        // If no data, return sample data for last 6 months
        if (result.isEmpty()) {
            String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
            int currentYear = LocalDateTime.now().getYear();
            for (String month : months) {
                result.add(new AdminRevenueDataPoint(month, 0.0, currentYear));
            }
        }

        return result;
    }

    private List<AdminTopVenue> getTopPerformingVenues(int limit) {
        List<Venue> venues = venueRepository.findAll();

        List<AdminTopVenue> topVenues = venues.stream()
                .map(venue -> {
                    // Get bookings for this venue
                    List<Booking> venueBookings = bookingRepository.findAll().stream()
                            .filter(b -> b.getVenue().getId().equals(venue.getId()))
                            .collect(Collectors.toList());

                    Long bookingsCount = (long) venueBookings.size();

                    // Calculate revenue from completed payments
                    Double revenue = paymentRepository.findAll().stream()
                            .filter(p -> "COMPLETED".equals(p.getStatus()))
                            .filter(p -> venueBookings.stream()
                                    .anyMatch(b -> b.getId().equals(p.getBooking().getId())))
                            .mapToDouble(Payment::getAmount)
                            .sum();

                    // Mock growth calculation (you can implement actual growth logic)
                    Double growth = Math.random() * 20; // Random growth between 0-20%

                    return new AdminTopVenue(
                            venue.getId(),
                            venue.getName(),
                            revenue,
                            bookingsCount,
                            growth
                    );
                })
                .sorted((v1, v2) -> Double.compare(v2.revenue(), v1.revenue()))
                .limit(limit)
                .collect(Collectors.toList());

        return topVenues;
    }

    private List<AdminSportPopularity> calculateSportPopularity() {
        List<Booking> bookings = bookingRepository.findAll();
        Long totalBookings = (long) bookings.size();

        if (totalBookings == 0) {
            return new ArrayList<>();
        }

        // Group bookings by sport type
        Map<String, Long> sportCounts = bookings.stream()
                .filter(b -> b.getSportType() != null && !b.getSportType().isEmpty())
                .collect(Collectors.groupingBy(
                        Booking::getSportType,
                        Collectors.counting()
                ));

        // Convert to AdminSportPopularity with percentages
        return sportCounts.entrySet().stream()
                .map(entry -> {
                    String sport = entry.getKey();
                    Long count = entry.getValue();
                    Double percentage = (count * 100.0) / totalBookings;

                    return new AdminSportPopularity(sport, count, percentage);
                })
                .sorted((s1, s2) -> Long.compare(s2.bookings(), s1.bookings()))
                .collect(Collectors.toList());
    }

    private List<AdminTimeSlot> calculatePeakBookingTimes() {
        List<Booking> bookings = bookingRepository.findAll();

        // Define time slots
        Map<String, Long> timeSlotCounts = new LinkedHashMap<>();
        timeSlotCounts.put("06:00 - 09:00", 0L);
        timeSlotCounts.put("09:00 - 12:00", 0L);
        timeSlotCounts.put("12:00 - 15:00", 0L);
        timeSlotCounts.put("15:00 - 18:00", 0L);
        timeSlotCounts.put("18:00 - 21:00", 0L);
        timeSlotCounts.put("21:00 - 24:00", 0L);

        // Count bookings in each time slot
        bookings.forEach(booking -> {
            int hour = booking.getStartTime().getHour();

            String slot;
            if (hour >= 6 && hour < 9) slot = "06:00 - 09:00";
            else if (hour >= 9 && hour < 12) slot = "09:00 - 12:00";
            else if (hour >= 12 && hour < 15) slot = "12:00 - 15:00";
            else if (hour >= 15 && hour < 18) slot = "15:00 - 18:00";
            else if (hour >= 18 && hour < 21) slot = "18:00 - 21:00";
            else slot = "21:00 - 24:00";

            timeSlotCounts.merge(slot, 1L, Long::sum);
        });

        // Convert to list
        return timeSlotCounts.entrySet().stream()
                .map(entry -> new AdminTimeSlot(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public byte[] exportAnalytics(String startDate, String endDate, String format) {
        // TODO: Implement CSV/Excel export logic
        // For now, return empty byte array
        return new byte[0];
    }

    // ==================== CONTENT MODERATION ====================

    public List<AdminContentItem> getContentItems(String status, String type, String search, Integer page, Integer perPage) {
        return new ArrayList<>();
    }

    public void moderateContent(Long id, String action) {
    }

    // ==================== ACTIVITY LOG ====================

    public List<AdminActivityLog> getActivities(String type, Long userId, Long venueId,
                                                String startDate, String endDate, Integer page, Integer perPage) {
        return new ArrayList<>();
    }

    // Old methods for backward compatibility
    public AnalyticsDto getAnalytics() {
        return new AnalyticsDto(
                userRepository.count(),
                venueRepository.count(),
                bookingRepository.count(),
                paymentRepository.sumSuccessfulPayments() != null ? paymentRepository.sumSuccessfulPayments() : 0.0
        );
    }

    public List<RevenueReportDto> getRevenueReport(String start, String end) {
        return List.of(
                new RevenueReportDto("2025-11-10", 15000.0, 10L),
                new RevenueReportDto("2025-11-11", 18000.0, 12L)
        );
    }
}