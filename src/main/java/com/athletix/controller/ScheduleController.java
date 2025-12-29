package com.athletix.controller;

import com.athletix.dto.schedule.ScheduleRequest;
import com.athletix.dto.schedule.ScheduleResponse;
import com.athletix.entity.*;
import com.athletix.repository.ScheduleRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.service.AuthService;
import com.athletix.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ScheduleRepository scheduleRepository;
    private final VenueRepository venueRepository;
    private final AuthService authService;

    /**
     * Get all schedules for owner's venues
     */
    @GetMapping
    public ResponseEntity<?> getMySchedules(@RequestHeader("Authorization") String auth) {
        try {
            User owner = authService.validateVenueOwner(auth);
            List<ScheduleResponse> schedules = scheduleService.getSchedulesByOwner(owner.getUserId());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", schedules
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Get schedules for specific venue
     */
    @GetMapping("/venue/{venueId}")
    public ResponseEntity<?> getVenueSchedules(
            @PathVariable Long venueId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestHeader("Authorization") String auth) {
        try {
            User owner = authService.validateVenueOwner(auth);

            // Verify venue ownership
            Venue venue = venueRepository.findById(venueId)
                    .orElseThrow(() -> new RuntimeException("Venue not found"));
            if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
                throw new RuntimeException("Not authorized");
            }

            List<ScheduleResponse> schedules;
            if (startDate != null && endDate != null) {
                schedules = scheduleService.getSchedulesByVenueAndDateRange(venueId, startDate, endDate);
            } else {
                schedules = scheduleService.getSchedulesByVenue(venueId);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", schedules
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Create or update schedule
     */
    @PostMapping
    public ResponseEntity<?> createSchedule(
            @RequestBody ScheduleRequest req,
            @RequestHeader("Authorization") String auth) {
        try {
            User owner = authService.validateVenueOwner(auth);

            // Verify venue ownership
            Venue venue = venueRepository.findById(req.venueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found"));
            if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
                throw new RuntimeException("Not authorized");
            }

            ScheduleResponse schedule = scheduleService.createOrUpdateSchedule(req);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Schedule created successfully",
                    "data", schedule
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Block a date (close venue for specific date)
     */
    @PostMapping("/block")
    public ResponseEntity<?> blockDate(
            @RequestBody BlockDateRequest req,
            @RequestHeader("Authorization") String auth) {
        try {
            User owner = authService.validateVenueOwner(auth);

            Venue venue = venueRepository.findById(req.venueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found"));
            if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
                throw new RuntimeException("Not authorized");
            }

            ScheduleResponse schedule = scheduleService.blockDate(
                    req.venueId(),
                    req.date(),
                    req.reason()
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Date blocked successfully",
                    "data", schedule
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Unblock a date
     */
    @PostMapping("/unblock/{scheduleId}")
    public ResponseEntity<?> unblockDate(
            @PathVariable Long scheduleId,
            @RequestHeader("Authorization") String auth) {
        try {
            User owner = authService.validateVenueOwner(auth);

            Schedule schedule = scheduleRepository.findById(scheduleId)
                    .orElseThrow(() -> new RuntimeException("Schedule not found"));

            if (!schedule.getVenue().getOwner().getUserId().equals(owner.getUserId())) {
                throw new RuntimeException("Not authorized");
            }

            ScheduleResponse updated = scheduleService.unblockSchedule(scheduleId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Date unblocked successfully",
                    "data", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Delete schedule
     */
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<?> deleteSchedule(
            @PathVariable Long scheduleId,
            @RequestHeader("Authorization") String auth) {
        try {
            User owner = authService.validateVenueOwner(auth);

            Schedule schedule = scheduleRepository.findById(scheduleId)
                    .orElseThrow(() -> new RuntimeException("Schedule not found"));

            if (!schedule.getVenue().getOwner().getUserId().equals(owner.getUserId())) {
                throw new RuntimeException("Not authorized");
            }

            scheduleService.deleteSchedule(scheduleId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Schedule deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Auto-generate schedules from venue operating hours
     */
    @PostMapping("/generate/{venueId}")
    public ResponseEntity<?> generateSchedules(
            @PathVariable Long venueId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestHeader("Authorization") String auth) {
        try {
            User owner = authService.validateVenueOwner(auth);

            Venue venue = venueRepository.findById(venueId)
                    .orElseThrow(() -> new RuntimeException("Venue not found"));
            if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
                throw new RuntimeException("Not authorized");
            }

            List<ScheduleResponse> schedules = scheduleService.generateSchedulesFromOperatingHours(
                    venueId,
                    startDate,
                    endDate
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", schedules.size() + " schedules generated",
                    "data", schedules
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // DTOs
    record BlockDateRequest(Long venueId, LocalDate date, String reason) {}
}