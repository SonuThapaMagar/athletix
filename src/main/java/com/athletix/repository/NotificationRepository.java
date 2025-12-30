package com.athletix.repository;

import com.athletix.entity.Notification;
import com.athletix.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find all notifications for a user with pagination
     */
    Page<Notification> findByUser(User user, Pageable pageable);

    /**
     * Find unread notifications for a user with pagination
     */
    Page<Notification> findByUserAndIsReadFalse(User user, Pageable pageable);

    /**
     * Count unread notifications for a user
     */
    long countByUserAndIsReadFalse(User user);

    /**
     * Mark all notifications as read for a specific user
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.userId = :userId AND n.isRead = false")
    void markAllAsReadForUser(@Param("userId") Long userId);

    /**
     * Delete all notifications for a user (useful for cleanup)
     */
    void deleteByUser(User user);
}