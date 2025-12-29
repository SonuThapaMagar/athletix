package com.athletix.service;

import com.athletix.dto.schedule.ScheduleRequest;
import com.athletix.dto.schedule.ScheduleResponse;
import com.athletix.entity.*;
import com.athletix.repository.ScheduleRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;

    public List<ScheduleResponse> getSchedulesByOwner(Long ownerId) {
        return scheduleRepository.findByVenue_Owner_UserId(ownerId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ScheduleResponse> getSchedulesByVenue(Long venueId) {
        return scheduleRepository.findByVenue_IdOrderByDateAsc(venueId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ScheduleResponse> getSchedulesByVenueAndDateRange(
            Long venueId,
            LocalDate startDate,
            LocalDate endDate) {
        return scheduleRepository.findByVenueAndDateRange(venueId, startDate, endDate).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ScheduleResponse createOrUpdateSchedule(ScheduleRequest req) {
        Venue venue = venueRepository.findById(req.venueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        // Check if schedule already exists for this date
        Optional<Schedule> existing = scheduleRepository.findByVenue_IdAndDate(
                req.venueId(),
                req.date()
        );

        Schedule schedule;
        if (existing.isPresent()) {
            // Update existing
            schedule = existing.get();
            schedule.setStartTime(req.startTime());
            schedule.setEndTime(req.endTime());
            schedule.setType(req.type() != null ? req.type() : ScheduleType.NORMAL);
            schedule.setBlocked(req.isBlocked() != null ? req.isBlocked() : false);
            schedule.setReason(req.reason());
            schedule.setNotes(req.notes());
        } else {
            // Create new
            schedule = Schedule.builder()
                    .venue(venue)
                    .date(req.date())
                    .startTime(req.startTime())
                    .endTime(req.endTime())
                    .type(req.type() != null ? req.type() : ScheduleType.NORMAL)
                    .isBlocked(req.isBlocked() != null ? req.isBlocked() : false)
                    .reason(req.reason())
                    .notes(req.notes())
                    .build();
        }

        schedule = scheduleRepository.save(schedule);
        return toResponse(schedule);
    }

    @Transactional
    public ScheduleResponse blockDate(Long venueId, LocalDate date, String reason) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        // Check if there are existing bookings for this date
        // You might want to prevent blocking if bookings exist

        Optional<Schedule> existing = scheduleRepository.findByVenue_IdAndDate(venueId, date);

        Schedule schedule;
        if (existing.isPresent()) {
            schedule = existing.get();
            schedule.setBlocked(true);
            schedule.setType(ScheduleType.CLOSED);
            schedule.setReason(reason);
        } else {
            schedule = Schedule.builder()
                    .venue(venue)
                    .date(date)
                    .type(ScheduleType.CLOSED)
                    .isBlocked(true)
                    .reason(reason)
                    .build();
        }

        schedule = scheduleRepository.save(schedule);
        return toResponse(schedule);
    }

    @Transactional
    public ScheduleResponse unblockSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        schedule.setBlocked(false);
        schedule.setType(ScheduleType.NORMAL);
        schedule.setReason(null);

        schedule = scheduleRepository.save(schedule);
        return toResponse(schedule);
    }

    @Transactional
    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }

    /**
     * Auto-generate schedules from venue operating hours
     */
    @Transactional
    public List<ScheduleResponse> generateSchedulesFromOperatingHours(
            Long venueId,
            LocalDate startDate,
            LocalDate endDate) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (venue.getOperatingHours() == null || venue.getOperatingHours().isEmpty()) {
            throw new RuntimeException("Venue has no operating hours configured");
        }

        List<Schedule> schedules = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            final LocalDate dateToCheck = currentDate;

            // Check if schedule already exists for this date
            Optional<Schedule> existing = scheduleRepository.findByVenue_IdAndDate(
                    venueId,
                    dateToCheck
            );

            if (existing.isEmpty()) {
                // Get day of week
                DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
                String dayName = getDayName(dayOfWeek);

                // Find matching operating hours
                Optional<OperatingHourEmbed> operatingHour = venue.getOperatingHours().stream()
                        .filter(oh -> oh.getDay().equalsIgnoreCase(dayName))
                        .findFirst();

                if (operatingHour.isPresent()) {
                    OperatingHourEmbed oh = operatingHour.get();

                    // Parse time strings (assuming format "9:00 AM - 10:00 PM")
                    LocalTime[] times = parseTimeRange(oh.getOpenTime());

                    if (times != null) {
                        Schedule schedule = Schedule.builder()
                                .venue(venue)
                                .date(dateToCheck)
                                .startTime(times[0])
                                .endTime(times[1])
                                .type(ScheduleType.NORMAL)
                                .isBlocked(false)
                                .build();

                        schedules.add(schedule);
                    }
                }
            }

            currentDate = currentDate.plusDays(1);
        }

        if (!schedules.isEmpty()) {
            schedules = scheduleRepository.saveAll(schedules);
        }

        return schedules.stream()
                .map(this::toResponse)
                .toList();
    }

    private String getDayName(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> "Monday";
            case TUESDAY -> "Tuesday";
            case WEDNESDAY -> "Wednesday";
            case THURSDAY -> "Thursday";
            case FRIDAY -> "Friday";
            case SATURDAY -> "Saturday";
            case SUNDAY -> "Sunday";
        };
    }

    private LocalTime[] parseTimeRange(String timeRange) {
        try {
            // Parse format like "9:00 AM - 10:00 PM"
            String[] parts = timeRange.split("-");
            if (parts.length != 2) return null;

            LocalTime startTime = parseTime(parts[0].trim());
            LocalTime endTime = parseTime(parts[1].trim());

            return new LocalTime[]{startTime, endTime};
        } catch (Exception e) {
            return null;
        }
    }

    private LocalTime parseTime(String time) {
        // Parse "9:00 AM" or "10:00 PM"
        time = time.toUpperCase().trim();
        boolean isPM = time.endsWith("PM");
        boolean isAM = time.endsWith("AM");

        time = time.replace("AM", "").replace("PM", "").trim();
        String[] parts = time.split(":");

        int hour = Integer.parseInt(parts[0]);
        int minute = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;

        if (isPM && hour != 12) {
            hour += 12;
        } else if (isAM && hour == 12) {
            hour = 0;
        }

        return LocalTime.of(hour, minute);
    }

    private ScheduleResponse toResponse(Schedule s) {
        return new ScheduleResponse(
                s.getId(),
                s.getVenue().getId(),
                s.getVenue().getName(),
                s.getDate(),
                s.getStartTime(),
                s.getEndTime(),
                s.getType(),
                s.isBlocked(),
                s.getReason(),
                s.getNotes(),
                s.getCreatedAt()
        );
    }
}