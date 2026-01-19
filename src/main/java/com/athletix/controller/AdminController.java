package com.athletix.controller;

import com.athletix.dto.admin.*;
import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.dto.response.ApiResponse;
import com.athletix.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ==================== DASHBOARD ====================
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardData> getDashboardData() {
        return ResponseEntity.ok(adminService.getDashboardData());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/dashboard/recent-activities")
    public ResponseEntity<List<AdminRecentActivity>> getRecentActivities(
            @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(adminService.getRecentActivities(limit));
    }

    // ==================== USER MANAGEMENT ====================
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PaginationResponse<AdminUserDto>>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer perPage) {

        PaginationResponse<AdminUserDto> result = adminService.getAllUsers(role, status, search, page, perPage);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "Users retrieved successfully", result)
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserDto> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(adminService.updateUser(id, updates));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<String> suspendUser(@PathVariable Long id) {
        adminService.suspendUser(id);
        return ResponseEntity.ok("User suspended successfully");
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(@PathVariable Long id) {
        adminService.activateUser(id);
        return ResponseEntity.ok("User activated successfully");
    }

    // ==================== VENUE MANAGEMENT ====================
    @GetMapping("/venues")
    public ResponseEntity<ApiResponse<PaginationResponse<AdminVenueDto>>> getAllVenues(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer perPage) {

        PaginationResponse<AdminVenueDto> result = adminService.getAllVenues(status, search, page, perPage);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "Venues retrieved successfully", result)
        );
    }

    @GetMapping("/venues/{id}")
    public ResponseEntity<AdminVenueDto> getVenueById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getVenueById(id));
    }

    @PutMapping("/venues/{id}")
    public ResponseEntity<AdminVenueDto> updateVenue(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(adminService.updateVenue(id, updates));
    }

    @DeleteMapping("/venues/{id}")
    public ResponseEntity<String> deleteVenue(@PathVariable Long id) {
        adminService.deleteVenue(id);
        return ResponseEntity.ok("Venue deleted successfully");
    }

    // ==================== BOOKING MANAGEMENT ====================
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PaginationResponse<AdminBookingDto>>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long venueId,
            @RequestParam(required = false) Long playerId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer perPage) {

        PaginationResponse<AdminBookingDto> result = adminService.getAllBookings(
                status, venueId, playerId, startDate, endDate, search, page, perPage
        );

        return ResponseEntity.ok(
                new ApiResponse<>("success", "Bookings retrieved successfully", result)
        );
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<AdminBookingDto> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getBookingById(id));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        adminService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    // ==================== PAYMENT MANAGEMENT ====================
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<AdminPaymentDto>>> getAllPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long venueId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer perPage) {

        List<AdminPaymentDto> payments = adminService.getAllPayments(
                status, venueId, startDate, endDate, paymentMethod, search, page, perPage
        );

        return ResponseEntity.ok(
                new ApiResponse<>("success", "Payments retrieved successfully", payments)
        );
    }

    @GetMapping("/payments/summary")
    public ResponseEntity<AdminPaymentSummary> getPaymentSummary(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(adminService.getPaymentSummary(startDate, endDate));
    }

    @GetMapping("/payments/export")
    public ResponseEntity<byte[]> exportPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long venueId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = adminService.exportPayments(status, venueId, startDate, endDate, format);
        String filename = "payments_export." + format;
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(data);
    }

    // ==================== ANALYTICS ====================
    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsData> getAnalyticsData(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long venueId) {
        return ResponseEntity.ok(adminService.getAnalyticsData(startDate, endDate, venueId));
    }

    @GetMapping("/analytics/stats")
    public ResponseEntity<AdminAnalyticsStats> getAnalyticsStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(adminService.getAnalyticsStats(startDate, endDate));
    }

    @GetMapping("/analytics/export")
    public ResponseEntity<byte[]> exportAnalytics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = adminService.exportAnalytics(startDate, endDate, format);
        String filename = "analytics_export." + format;
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(data);
    }

    // ==================== CONTENT MODERATION ====================
    @GetMapping("/content")
    public ResponseEntity<List<AdminContentItem>> getContentItems(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer perPage) {
        return ResponseEntity.ok(adminService.getContentItems(status, type, search, page, perPage));
    }

    @PutMapping("/content/{id}")
    public ResponseEntity<String> moderateContent(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String action = body.get("action");
        adminService.moderateContent(id, action);
        return ResponseEntity.ok("Content " + action + " successfully");
    }

    // ==================== ACTIVITY LOG ====================
    @GetMapping("/activities")
    public ResponseEntity<List<AdminActivityLog>> getActivities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long venueId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer perPage) {
        return ResponseEntity.ok(adminService.getActivities(type, userId, venueId,
                startDate, endDate, page, perPage));
    }


}