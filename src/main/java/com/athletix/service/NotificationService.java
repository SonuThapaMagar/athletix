package com.athletix.service;

import com.athletix.entity.Notification;
import com.athletix.entity.User;
import com.athletix.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    /**
     * Get paginated notifications for a user
     */
    public Page<Notification> getUserNotifications(User user, int page, int perPage) {
        Pageable pageable = PageRequest.of(
                page - 1,
                perPage,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return notificationRepository.findByUser(user, pageable);
    }

    /**
     * Get paginated unread notifications for a user
     */
    public Page<Notification> getUnreadNotifications(User user, int page, int perPage) {
        Pageable pageable = PageRequest.of(
                page - 1,
                perPage,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return notificationRepository.findByUserAndIsReadFalse(user, pageable);
    }

    /**
     * Get count of unread notifications
     */
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    /**
     * Mark a specific notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadForUser(user.getUserId());
    }

    /**
     * Delete a specific notification
     */
    @Transactional
    public void deleteNotification(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notificationRepository.delete(notification);
    }

    /**
     * Create a new notification
     */
    @Transactional
    public Notification createNotification(
            User user,
            String title,
            String message,
            Notification.NotificationType type,
            Long relatedEntityId
    ) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityId(relatedEntityId)
                .isRead(false)
                .emailSent(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Create and optionally send email notification
     */
    @Transactional
    public Notification createAndNotify(
            User user,
            String title,
            String message,
            Notification.NotificationType type,
            Long relatedEntityId,
            boolean sendEmail
    ) {
        Notification notification = createNotification(user, title, message, type, relatedEntityId);

        if (sendEmail) {
            try {
                emailService.sendEmail(user.getEmail(), title, message);
                notification.setEmailSent(true);
                notificationRepository.save(notification);
            } catch (Exception e) {
                // Log error but don't fail the notification creation
                System.err.println("Failed to send email notification: " + e.getMessage());
            }
        }

        return notification;
    }
}