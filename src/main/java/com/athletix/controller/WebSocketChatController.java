package com.athletix.controller;

import com.athletix.dto.chat.SendMessageRequest;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import com.athletix.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final ChatService chatService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @MessageMapping("/chat/{groupId}")
    public void sendMessage(
            @DestinationVariable Long groupId,
            @Payload SendMessageRequest message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        try {
            // Extract token from WebSocket headers
            String token = (String) headerAccessor.getSessionAttributes().get("token");

            if (token != null && !jwtUtil.isTokenExpired(token)) {
                String email = jwtUtil.extractEmail(token);
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // Send message - this will broadcast via WebSocket
                chatService.sendMessage(groupId, message, user);
            }
        } catch (Exception e) {
            // Log error
            System.err.println("Error sending WebSocket message: " + e.getMessage());
        }
    }

    @MessageMapping("/chat/{groupId}/typing")
    public void userTyping(
            @DestinationVariable Long groupId,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        // Implementation for typing indicator (optional)
        // You can broadcast typing events to the group
    }
}