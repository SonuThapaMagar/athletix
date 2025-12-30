package com.athletix.controller;

import com.athletix.entity.Notification;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import com.athletix.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * Get all notifications for logged-in user
     */
    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage) {

        User user = getUserFromToken(authHeader);
        Page<Notification> notifications = notificationService.getUserNotifications(user, page, perPage);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", notifications.getContent(),
                "pagination", Map.of(
                        "currentPage", notifications.getNumber() + 1,
                        "totalPages", notifications.getTotalPages(),
                        "totalItems", notifications.getTotalElements(),
                        "perPage", perPage
                )
        ));
    }

    /**
     * Get unread notifications only
     */
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage) {

        User user = getUserFromToken(authHeader);
        Page<Notification> notifications = notificationService.getUnreadNotifications(user, page, perPage);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", notifications.getContent(),
                "unreadCount", notificationService.getUnreadCount(user),
                "pagination", Map.of(
                        "currentPage", notifications.getNumber() + 1,
                        "totalPages", notifications.getTotalPages(),
                        "totalItems", notifications.getTotalElements(),
                        "perPage", perPage
                )
        ));
    }

    /**
     * Get unread count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        long count = notificationService.getUnreadCount(user);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "unreadCount", count
        ));
    }

    /**
     * Mark notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);
        notificationService.markAsRead(id, user);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Notification marked as read"
        ));
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        notificationService.markAllAsRead(user);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "All notifications marked as read"
        ));
    }

    /**
     * Delete notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);
        notificationService.deleteNotification(id, user);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Notification deleted"
        ));
    }

    // Helper method
    private User getUserFromToken(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}