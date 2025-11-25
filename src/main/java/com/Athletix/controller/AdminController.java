package com.athletix.controller;

import com.athletix.dto.admin.*;
import com.athletix.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // 1. USER MANAGEMENT
    @GetMapping("/users")
    public List<UserDto> getAllUsers(){
        return adminService.getAllUsers();
    }
    @GetMapping("/users/{id}")
//    public UserDto getUser(@PathVariable Long id) {
//        return adminService.getUser(id);
//    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<String> suspendUser(@PathVariable Long id) {
        adminService.suspendUser(id);
        return ResponseEntity.ok("User suspended");
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(@PathVariable Long id) {
        adminService.activateUser(id);
        return ResponseEntity.ok("User activated");
    }

    // 2. VENUE MANAGEMENT
    @GetMapping("/venues")
    public List<VenueDto> getAllVenues() {
        return adminService.getAllVenues();
    }

    @PutMapping("/venues/{id}/approve")
    public ResponseEntity<String> approveVenue(@PathVariable Long id) {
        adminService.approveVenue(id);
        return ResponseEntity.ok("Venue approved");
    }

    @PutMapping("/venues/{id}/reject")
    public ResponseEntity<String> rejectVenue(@PathVariable Long id) {
        adminService.rejectVenue(id);
        return ResponseEntity.ok("Venue rejected");
    }

    // 3. BOOKINGS & PAYMENTS
    @GetMapping("/bookings")
    public List<BookingDto> getAllBookings() {
        return adminService.getAllBookings();
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        adminService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled");
    }

    // 4. ANALYTICS & REPORTS
    @GetMapping("/analytics")
    public AnalyticsDto getAnalytics() {
        return adminService.getAnalytics();
    }

    @GetMapping("/reports/revenue")
    public List<RevenueReportDto> getRevenueReport(
            @RequestParam String start,
            @RequestParam String end) {
        return adminService.getRevenueReport(start, end);
    }

    // 5. PLATFORM CONTROL
    @PostMapping("/broadcast")
    public ResponseEntity<String> broadcast(@RequestBody BroadcastDto dto) {
        adminService.broadcast(dto.message());
        return ResponseEntity.ok("Broadcast sent");
    }

}
