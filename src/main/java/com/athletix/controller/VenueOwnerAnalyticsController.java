// controller/VenueOwnerAnalyticsController.java
package com.athletix.controller;

import com.athletix.dto.analytics.*;
import com.athletix.dto.response.ApiResponse;
import com.athletix.service.VenueOwnerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue-owner/analytics")
@RequiredArgsConstructor
public class VenueOwnerAnalyticsController {

    private final VenueOwnerAnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<AnalyticsData>> getAnalyticsData(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute AnalyticsFilters filters
    ) {
        AnalyticsData data = analyticsService.getAnalyticsData(authHeader, filters);
        return ResponseEntity.ok(new ApiResponse<>("success", "Analytics data fetched successfully", data));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AnalyticsStats>> getStats(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute AnalyticsFilters filters
    ) {
        AnalyticsStats stats = analyticsService.getStats(authHeader, filters);
        return ResponseEntity.ok(new ApiResponse<>("success", "Stats fetched successfully", stats));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<List<RevenueDataPoint>>> getRevenueData(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute AnalyticsFilters filters
    ) {
        List<RevenueDataPoint> data = analyticsService.getRevenueData(authHeader, filters);
        return ResponseEntity.ok(new ApiResponse<>("success", "Revenue data fetched successfully", data));
    }

    @GetMapping("/top-venues")
    public ResponseEntity<ApiResponse<List<TopVenue>>> getTopVenues(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute AnalyticsFilters filters
    ) {
        List<TopVenue> venues = analyticsService.getTopVenues(authHeader, filters);
        return ResponseEntity.ok(new ApiResponse<>("success", "Top venues fetched successfully", venues));
    }

    @GetMapping("/sport-popularity")
    public ResponseEntity<ApiResponse<List<SportPopularity>>> getSportPopularity(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute AnalyticsFilters filters
    ) {
        List<SportPopularity> data = analyticsService.getSportPopularity(authHeader, filters);
        return ResponseEntity.ok(new ApiResponse<>("success", "Sport popularity fetched successfully", data));
    }

    @GetMapping("/peak-times")
    public ResponseEntity<ApiResponse<List<TimeSlot>>> getPeakBookingTimes(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute AnalyticsFilters filters
    ) {
        List<TimeSlot> times = analyticsService.getPeakBookingTimes(authHeader, filters);
        return ResponseEntity.ok(new ApiResponse<>("success", "Peak times fetched successfully", times));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAnalytics(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute AnalyticsFilters filters,
            @RequestParam(defaultValue = "csv") String format
    ) {
        // TODO: Implement CSV/Excel export
        return ResponseEntity.ok(new byte[0]);
    }
}