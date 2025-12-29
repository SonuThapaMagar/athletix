package com.athletix.controller;

import com.athletix.dto.dashboard.DashboardData;
import com.athletix.dto.dashboard.DashboardStats;
import com.athletix.dto.dashboard.RecentBooking;
import com.athletix.dto.response.ApiResponse;
import com.athletix.service.VenueOwnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue-owner/dashboard")
@RequiredArgsConstructor
public class VenueOwnerDashboardController {

    private final VenueOwnerDashboardService dashboardService;

    /**
     * GET /api/venue-owner/dashboard
     * Get complete dashboard data (stats + recent bookings)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardData>> getDashboardData(
            @RequestHeader("Authorization") String authHeader
    ) {
        DashboardData data = dashboardService.getDashboardData(authHeader);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Dashboard data fetched successfully",
                        data
                )
        );
    }

    /**
     * GET /api/venue-owner/dashboard/stats
     * Get dashboard statistics only
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getStats(
            @RequestHeader("Authorization") String authHeader
    ) {
        DashboardStats stats = dashboardService.getStats(authHeader);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Dashboard stats fetched successfully",
                        stats
                )
        );
    }

    /**
     * GET /api/venue-owner/dashboard/recent-bookings
     * Get recent bookings only
     */
    @GetMapping("/recent-bookings")
    public ResponseEntity<ApiResponse<List<RecentBooking>>> getRecentBookings(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false, defaultValue = "5") Integer limit
    ) {
        List<RecentBooking> bookings = dashboardService.getRecentBookingsOnly(authHeader, limit);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Recent bookings fetched successfully",
                        bookings
                )
        );
    }
}
