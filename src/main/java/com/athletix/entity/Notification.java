//package com.athletix.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
//@Table(name = "notifications")
//public class Notification {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long notificationId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    @Column(nullable = false)
//    private String title;
//
//    @Column(columnDefinition = "TEXT")
//    private String message;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private NotificationType type;
//
//    @Column(nullable = false)
//    @Builder.Default
//    private boolean isRead = false;
//
//    @Column(nullable = false)
//    @Builder.Default
//    private boolean emailSent = false;
//
//    // Optional: link to related entity (booking, venue, etc.)
//    private Long relatedMatchId;
//    private Long relatedRequestId;
//
//    @CreationTimestamp
//    private LocalDateTime createdAt;
//
//    public enum NotificationType {
//        BOOKING_CONFIRMED,
//        BOOKING_CANCELLED,
//        BOOKING_REMINDER,
//        PAYMENT_SUCCESS,
//        PAYMENT_FAILED,
//        VENUE_APPROVED,
//        VENUE_REJECTED,
//        SYSTEM_NOTIFICATION,
//        GENERAL,
//
//        MATCH_REQUEST,          // When someone requests to join your match
//        REQUEST_ACCEPTED,       // When your request is accepted
//        REQUEST_REJECTED,       // When your request is rejected
//        MATCH_CANCELLED,        // When a match you joined is cancelled
//        MATCH_UPDATED,          // When match details change
//        MATCH_REMINDER,
//    }
//}