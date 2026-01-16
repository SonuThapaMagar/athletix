# Match Request Acceptance Flow - Backend Implementation

This document contains all the Spring Boot backend code you need to implement the match request acceptance flow with email and in-app notifications.

## 📋 Complete Flow

1. **Player A** requests to join **Player B's** match
2. **Player B** accepts the request via `/api/player/matches/requests/{requestId}`
3. **System** automatically:
   - Updates match request status to ACCEPTED
   - Increments match current players count
   - Creates in-app notification for Player A
   - Sends email to Player A
4. **Player A** receives:
   - Email notification (instant)
   - In-app notification (shows in dashboard bell icon)
5. **Player A** cannot request again (validation prevents it)

---

## 1. Notification Entity

**File:** `src/main/java/com/athletix/entity/Notification.java`

```java
package com.athletix.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type = NotificationType.INFO;

    @Column(nullable = false)
    private Boolean isRead = false;

    private String relatedEntityType; // e.g., 'match', 'booking', 'venue'
    private Long relatedEntityId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum NotificationType {
        INFO, SUCCESS, WARNING, ERROR
    }
}
```

---

## 2. Notification Repository

**File:** `src/main/java/com/athletix/repository/NotificationRepository.java`

```java
package com.athletix.repository;

import com.athletix.entity.Notification;
import com.athletix.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Long countByUserAndIsReadFalse(User user);
    
    List<Notification> findByUserAndIsReadFalse(User user);
}
```

---

## 3. Email Service

**File:** `src/main/java/com/athletix/service/EmailService.java`

```java
package com.athletix.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@athletix.com");
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
        }
    }
    
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            helper.setFrom("noreply@athletix.com");
            
            mailSender.send(message);
            log.info("HTML email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to: {}", to, e);
        }
    }
    
    // Match-specific email templates
    public void sendMatchRequestAcceptedEmail(String playerEmail, String playerName, 
                                            String matchTitle, String matchDate, 
                                            String location, String creatorName) {
        String subject = "🎉 Your Match Request Has Been Accepted!";
        
        String htmlBody = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #2c5aa0 0%%, #1e3d6f 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .match-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .detail-row { margin: 10px 0; }
                    .label { font-weight: bold; color: #2c5aa0; }
                    .button { display: inline-block; padding: 12px 30px; background: #2c5aa0; 
                             color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Match Request Accepted!</h1>
                    </div>
                    <div class="content">
                        <p>Hi %s,</p>
                        <p>Great news! <strong>%s</strong> has accepted your request to join their match!</p>
                        
                        <div class="match-details">
                            <h3>Match Details:</h3>
                            <div class="detail-row">
                                <span class="label">Match:</span> %s
                            </div>
                            <div class="detail-row">
                                <span class="label">Date & Time:</span> %s
                            </div>
                            <div class="detail-row">
                                <span class="label">Location:</span> %s
                            </div>
                            <div class="detail-row">
                                <span class="label">Organized by:</span> %s
                            </div>
                        </div>
                        
                        <p>You can now view match details and chat with other players in your dashboard.</p>
                        
                        <center>
                            <a href="http://localhost:5173/player/matches" class="button">
                                View Match Details
                            </a>
                        </center>
                        
                        <p>See you on the field!</p>
                        <p>Best regards,<br><strong>The Athletix Team</strong></p>
                        
                        <div class="footer">
                            <p>This is an automated message from Athletix. Please do not reply to this email.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """, playerName, creatorName, matchTitle, matchDate, location, creatorName);
        
        sendHtmlEmail(playerEmail, subject, htmlBody);
    }
    
    public void sendMatchRequestRejectedEmail(String playerEmail, String playerName, 
                                             String matchTitle, String creatorName) {
        String subject = "Match Request Status Update";
        
        String htmlBody = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6b7280 0%%, #4b5563 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: #2c5aa0; 
                             color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Match Request Update</h1>
                    </div>
                    <div class="content">
                        <p>Hi %s,</p>
                        <p>Unfortunately, your request to join <strong>"%s"</strong> organized by %s was not accepted this time.</p>
                        
                        <p>Don't worry! There are many other matches available for you to join.</p>
                        
                        <center>
                            <a href="http://localhost:5173/player/matches" class="button">
                                Browse Other Matches
                            </a>
                        </center>
                        
                        <p>Best regards,<br><strong>The Athletix Team</strong></p>
                        
                        <div class="footer">
                            <p>This is an automated message from Athletix. Please do not reply to this email.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """, playerName, matchTitle, creatorName);
        
        sendHtmlEmail(playerEmail, subject, htmlBody);
    }
}
```

---

## 4. Notification Service

**File:** `src/main/java/com/athletix/service/NotificationService.java`

```java
package com.athletix.service;

import com.athletix.entity.Notification;
import com.athletix.entity.User;
import com.athletix.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private the NotificationRepository notificationRepository;

    @Transactional
    public Notification createNotification(
            User user,
            String title,
            String message,
            Notification.NotificationType type,
            String relatedEntityType,
            Long relatedEntityId
    ) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    public Page<Notification> getNotifications(User user, int page, int perPage) {
        Pageable pageable = PageRequest.of(page - 1, perPage);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public Page<Notification> getUnreadNotifications(User user, int page, int perPage) {
        Pageable pageable = PageRequest.of(page - 1, perPage);
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user, pageable);
    }

    public Long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(User user) {
        var notifications = notificationRepository.findByUserAndIsReadFalse(user);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void deleteNotification(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        notificationRepository.delete(notification);
    }
    
    // Match-specific notification helpers
    public void notifyMatchRequestAccepted(User player, String matchTitle, Long matchId, String creatorName) {
        String title = "Match Request Accepted! 🎉";
        String message = String.format(
            "Great news! %s has accepted your request to join '%s'. Check your matches to view details and connect with other players.",
            creatorName, matchTitle
        );
        
        createNotification(
            player,
            title,
            message,
            Notification.NotificationType.SUCCESS,
            "match",
            matchId
        );
    }
    
    public void notifyMatchRequestRejected(User player, String matchTitle, Long matchId, String creatorName) {
        String title = "Match Request Update";
        String message = String.format(
            "Your request to join '%s' organized by %s was not accepted. Browse other matches to find your next game!",
            matchTitle, creatorName
        );
        
        createNotification(
            player,
            title,
            message,
            Notification.NotificationType.INFO,
            "match",
            matchId
        );
    }
}
```

---

## 5. Updated MatchService

**File:** `src/main/java/com/athletix/service/MatchService.java`

Add these fields to your existing MatchService:

```java
private final EmailService emailService;
private final NotificationService notificationService;
```

Update the `respondToRequest` method:

```java
@Transactional
public MatchRequestResponse respondToRequest(
        Long requestId,
        RespondToRequestRequest request,
        User user
) {
    MatchRequest matchRequest = matchRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    Match match = matchRequest.getMatch();
    User player = matchRequest.getPlayer();

    if (!match.getCreator().getUserId().equals(user.getUserId())) {
        throw new RuntimeException("Only match creator can respond to requests");
    }

    if (matchRequest.getStatus() != MatchRequest.RequestStatus.PENDING) {
        throw new RuntimeException("This request has already been responded to");
    }

    if ("accept".equals(request.action())) {
        if (match.isFull()) {
            throw new RuntimeException("Match is already full");
        }
        matchRequest.setStatus(MatchRequest.RequestStatus.ACCEPTED);
        match.incrementPlayers();
        matchRepository.save(match);
        
        // ✅ Send in-app notification
        notificationService.notifyMatchRequestAccepted(
            player, 
            match.getTitle(), 
            match.getMatchId(), 
            user.getName()
        );
        
        // ✅ Send email notification
        emailService.sendMatchRequestAcceptedEmail(
            player.getEmail(),
            player.getName(),
            match.getTitle(),
            match.getMatchDateTime().toString(),
            match.getLocation(),
            user.getName()
        );
        
    } else {
        matchRequest.setStatus(MatchRequest.RequestStatus.REJECTED);
        
        // ✅ Send rejection notification
        notificationService.notifyMatchRequestRejected(
            player, 
            match.getTitle(), 
            match.getMatchId(), 
            user.getName()
        );
        
        // ✅ Send rejection email
        emailService.sendMatchRequestRejectedEmail(
            player.getEmail(),
            player.getName(),
            match.getTitle(),
            user.getName()
        );
    }

    matchRequest.setRespondedAt(LocalDateTime.now());
    matchRequest = matchRequestRepository.save(matchRequest);

    return toMatchRequestResponse(matchRequest);
}
```

---

## 6. Notification Controller

**File:** `src/main/java/com/athletix/controller/NotificationController.java`

```java
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
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            Page<Notification> notifications = notificationService.getNotifications(user, page, perPage);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", Map.of(
                            "data", notifications.getContent(),
                            "currentPage", notifications.getNumber() + 1,
                            "totalPages", notifications.getTotalPages(),
                            "totalItems", notifications.getTotalElements(),
                            "unreadCount", notificationService.getUnreadCount(user)
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            Page<Notification> notifications = notificationService.getUnreadNotifications(user, page, perPage);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", Map.of(
                            "data", notifications.getContent(),
                            "currentPage", notifications.getNumber() + 1,
                            "totalPages", notifications.getTotalPages(),
                            "totalItems", notifications.getTotalElements(),
                            "unreadCount", notificationService.getUnreadCount(user)
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            Long unreadCount = notificationService.getUnreadCount(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", Map.of("unreadCount", unreadCount)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            notificationService.markAsRead(id, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Notification marked as read"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            notificationService.markAllAsRead(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "All notifications marked as read"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            notificationService.deleteNotification(id, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Notification deleted"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    private User validateTokenAndGetUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid token");
        }
        String token = authHeader.substring(7);
        if (jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("Token expired");
        }
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
```

---

## 7. Application Configuration

**File:** `src/main/resources/application.properties` (or `application.yml`)

Add email configuration:

```properties
# Email Configuration (Gmail example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Enable async support
spring.task.execution.pool.core-size=2
spring.task.execution.pool.max-size=5
spring.task.execution.pool.queue-capacity=100
```

---

## 8. Enable Async Support

**File:** `src/main/java/com/athletix/config/AsyncConfig.java`

```java
package com.athletix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
}
```

---

## 9. Add Dependencies (pom.xml)

```xml
<!-- Email Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

---

## 10. Database Migration

Create a new Flyway migration or Liquibase changeset:

**File:** `src/main/resources/db/migration/V{number}__create_notifications_table.sql`

```sql
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## 🔄 Complete Flow Summary

### When Request is Accepted:
```
1. Player B clicks "Accept" on Player A's request
2. Frontend calls: PUT /api/player/matches/requests/{requestId} with { action: "accept" }
3. Backend (MatchService.respondToRequest):
   ├── Updates MatchRequest status to ACCEPTED
   ├── Increments match.currentPlayers
   ├── Creates Notification for Player A (in database)
   ├── Sends Email to Player A (async)
   └── Returns success response
4. Player A receives:
   ├── Email (opens in their inbox)
   └── In-app notification (shows in bell icon with badge)
5. Player A cannot request again (validation prevents it)
```

### Duplicate Request Prevention:
```java
// Already in your code:
if (matchRequestRepository.existsByMatchAndPlayer(match, player)) {
    throw new RuntimeException("You have already requested to join this match");
}
```

This prevents any player from requesting to join the same match twice, regardless of the previous request status.

---

## ✅ Testing Checklist

1. **Email Configuration:**
   - [ ] Configure SMTP settings in application.properties
   - [ ] Test email sending manually
   - [ ] Check spam folder if email doesn't arrive

2. **Database:**
   - [ ] Run migration to create notifications table
   - [ ] Verify foreign key constraints

3. **Backend:**
   - [ ] Test accept request flow
   - [ ] Verify notification is created
   - [ ] Verify email is sent
   - [ ] Test duplicate request prevention

4. **Frontend:**
   - [ ] Notification bell shows unread count
   - [ ] Notifications display correctly
   - [ ] "Request to Join" button disabled after requesting

---

## 🚀 Next Steps

1. Copy all Java files to your Spring Boot project
2. Update `pom.xml` with email dependency
3. Configure email settings in `application.properties`
4. Run database migration
5. Test the complete flow
6. Update frontend (next document)
