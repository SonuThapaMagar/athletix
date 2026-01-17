//package com.athletix.service;
//
//import com.athletix.entity.Match;
//import com.athletix.entity.MatchRequest;
//import com.athletix.entity.Notification;
//import com.athletix.entity.User;
//import com.athletix.repository.NotificationRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//public class NotificationService {
//
//    private final NotificationRepository notificationRepository;
//    private final EmailService emailService;
//
//    // ==================== MATCH-SPECIFIC NOTIFICATIONS ====================
//
//    @Transactional
//    public void notifyMatchRequest(MatchRequest matchRequest) {
//        Match match = matchRequest.getMatch();
//        User host = match.getCreator();
//        User player = matchRequest.getPlayer();
//
//        // Create in-app notification
//        Notification notification = Notification.builder()
//                .user(host)
//                .title("New Join Request")
//                .message(player.getName() + " wants to join your match: " + match.getTitle())
//                .type(Notification.NotificationType.MATCH_REQUEST)
//                .relatedMatchId(match.getMatchId())
//                .relatedRequestId(matchRequest.getRequestId())
//                .isRead(false)
//                .emailSent(false)
//                .build();
//
//        notificationRepository.save(notification);
//
//        // Send email
//        String emailBody = String.format(
//                "Hello %s,\n\n" +
//                        "%s wants to join your match:\n\n" +
//                        "Match: %s\n" +
//                        "Sport: %s\n" +
//                        "Date: %s\n" +
//                        "Location: %s\n\n" +
//                        "Their message: %s\n\n" +
//                        "Login to your dashboard to accept or reject this request.\n\n" +
//                        "Best regards,\nAthletix Team",
//                host.getName(),
//                player.getName(),
//                match.getTitle(),
//                match.getSportType(),
//                match.getMatchDateTime(),
//                match.getLocation(),
//                matchRequest.getMessage() != null ? matchRequest.getMessage() : "No message"
//        );
//
//        emailService.sendEmail(host.getEmail(), "New Join Request - " + match.getTitle(), emailBody);
//
//        notification.setEmailSent(true);
//        notificationRepository.save(notification);
//    }
//
//    @Transactional
//    public void notifyRequestAccepted(MatchRequest matchRequest) {
//        Match match = matchRequest.getMatch();
//        User player = matchRequest.getPlayer();
//        User host = match.getCreator();
//
//        // Create in-app notification
//        Notification notification = Notification.builder()
//                .user(player)
//                .title("Request Accepted!")
//                .message("Your request to join '" + match.getTitle() + "' has been accepted!")
//                .type(Notification.NotificationType.REQUEST_ACCEPTED)
//                .relatedMatchId(match.getMatchId())
//                .relatedRequestId(matchRequest.getRequestId())
//                .isRead(false)
//                .emailSent(false)
//                .build();
//
//        notificationRepository.save(notification);
//
//        // Send email
//        String emailBody = String.format(
//                "Hello %s,\n\n" +
//                        "Great news! Your request to join the match has been accepted.\n\n" +
//                        "Match Details:\n" +
//                        "Title: %s\n" +
//                        "Sport: %s\n" +
//                        "Location: %s\n" +
//                        "Date & Time: %s\n" +
//                        "Host: %s\n" +
//                        "Contact: %s\n\n" +
//                        "Current Players: %d/%d\n\n" +
//                        "See you at the match!\n\n" +
//                        "Best regards,\nAthletix Team",
//                player.getName(),
//                match.getTitle(),
//                match.getSportType(),
//                match.getLocation(),
//                match.getMatchDateTime(),
//                host.getName(),
//                match.getContactInfo() != null ? match.getContactInfo() : host.getPhone(),
//                match.getCurrentPlayers(),
//                match.getRequiredPlayers()
//        );
//
//        emailService.sendEmail(player.getEmail(), "Request Accepted - " + match.getTitle(), emailBody);
//
//        notification.setEmailSent(true);
//        notificationRepository.save(notification);
//    }
//
//    @Transactional
//    public void notifyRequestRejected(MatchRequest matchRequest) {
//        Match match = matchRequest.getMatch();
//        User player = matchRequest.getPlayer();
//
//        // Create in-app notification
//        Notification notification = Notification.builder()
//                .user(player)
//                .title("Request Declined")
//                .message("Your request to join '" + match.getTitle() + "' has been declined.")
//                .type(Notification.NotificationType.REQUEST_REJECTED)
//                .relatedMatchId(match.getMatchId())
//                .relatedRequestId(matchRequest.getRequestId())
//                .isRead(false)
//                .emailSent(false)
//                .build();
//
//        notificationRepository.save(notification);
//
//        // Send email
//        String emailBody = String.format(
//                "Hello %s,\n\n" +
//                        "Unfortunately, your request to join '%s' has been declined.\n\n" +
//                        "Don't worry! There are many other matches available on Athletix. " +
//                        "Check out our platform for more opportunities to play.\n\n" +
//                        "Best regards,\nAthletix Team",
//                player.getName(),
//                match.getTitle()
//        );
//
//        emailService.sendEmail(player.getEmail(), "Join Request Update", emailBody);
//
//        notification.setEmailSent(true);
//        notificationRepository.save(notification);
//    }
//
//    @Transactional
//    public void notifyMatchCancelled(Match match, User player) {
//        // Create in-app notification
//        Notification notification = Notification.builder()
//                .user(player)
//                .title("Match Cancelled")
//                .message("The match '" + match.getTitle() + "' has been cancelled by the host.")
//                .type(Notification.NotificationType.MATCH_CANCELLED)
//                .relatedMatchId(match.getMatchId())
//                .isRead(false)
//                .emailSent(false)
//                .build();
//
//        notificationRepository.save(notification);
//
//        // Send email
//        String emailBody = String.format(
//                "Hello %s,\n\n" +
//                        "We regret to inform you that the match '%s' has been cancelled by the host.\n\n" +
//                        "Match Details:\n" +
//                        "Sport: %s\n" +
//                        "Location: %s\n" +
//                        "Date & Time: %s\n\n" +
//                        "We apologize for any inconvenience.\n\n" +
//                        "Best regards,\nAthletix Team",
//                player.getName(),
//                match.getTitle(),
//                match.getSportType(),
//                match.getLocation(),
//                match.getMatchDateTime()
//        );
//
//        emailService.sendEmail(player.getEmail(), "Match Cancelled - " + match.getTitle(), emailBody);
//
//        notification.setEmailSent(true);
//        notificationRepository.save(notification);
//    }
//
//    // ==================== GENERAL NOTIFICATION METHODS ====================
//
//    public Page<Notification> getUserNotifications(User user, int page, int size) {
//        Pageable pageable = PageRequest.of(
//                page,
//                size,
//                Sort.by(Sort.Direction.DESC, "createdAt")
//        );
//        return notificationRepository.findByUser(user, pageable);
//    }
//
//    public Page<Notification> getUnreadNotifications(User user, int page, int size) {
//        Pageable pageable = PageRequest.of(
//                page,
//                size,
//                Sort.by(Sort.Direction.DESC, "createdAt")
//        );
//        return notificationRepository.findByUserAndIsReadFalse(user, pageable);
//    }
//
//    public long getUnreadCount(User user) {
//        return notificationRepository.countByUserAndIsReadFalse(user);
//    }
//
//    @Transactional
//    public void markAsRead(Long notificationId, User user) {
//        Notification notification = notificationRepository.findById(notificationId)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        if (!notification.getUser().getUserId().equals(user.getUserId())) {
//            throw new RuntimeException("Unauthorized");
//        }
//
//        notification.setRead(true);
//        notificationRepository.save(notification);
//    }
//
//    @Transactional
//    public void markAllAsRead(User user) {
//        notificationRepository.markAllAsReadForUser(user.getUserId());
//    }
//
//    @Transactional
//    public void deleteNotification(Long notificationId, User user) {
//        Notification notification = notificationRepository.findById(notificationId)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        if (!notification.getUser().getUserId().equals(user.getUserId())) {
//            throw new RuntimeException("Unauthorized");
//        }
//
//        notificationRepository.delete(notification);
//    }
//}