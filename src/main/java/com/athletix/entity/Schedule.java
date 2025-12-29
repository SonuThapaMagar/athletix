package com.athletix.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(nullable = false)
    private LocalDate date;  // Which date this schedule applies to

    @Column(name = "start_time")
    private LocalTime startTime;  // Start time for this day (overrides venue operating hours)

    @Column(name = "end_time")
    private LocalTime endTime;    // End time for this day

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleType type = ScheduleType.NORMAL;

    @Column(nullable = false)
    private boolean isBlocked = false;  // If true, no bookings allowed

    @Column(length = 500)
    private String reason;  // Reason for blocking (e.g., "Maintenance", "Holiday")

    @Column(length = 1000)
    private String notes;   // Additional notes

    @CreationTimestamp
    private LocalDateTime createdAt;
}