package com.athletix.controller;

import com.athletix.dto.chat.*;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import com.athletix.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // ==================== GROUP MANAGEMENT ====================

    @PostMapping("/groups")
    public ResponseEntity<?> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            ChatGroupResponse group = chatService.createGroup(request, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Group created successfully",
                    "data", group
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/groups")
    public ResponseEntity<?> getMyGroups(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            List<ChatGroupResponse> groups = chatService.getMyGroups(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", groups
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<?> getGroupById(
            @PathVariable Long groupId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            ChatGroupResponse group = chatService.getGroupById(groupId, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", group
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/groups/join/{inviteCode}")
    public ResponseEntity<?> joinGroupByCode(
            @PathVariable String inviteCode,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            ChatGroupResponse group = chatService.joinGroupByCode(inviteCode, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Successfully joined the group",
                    "data", group
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/groups/{groupId}/members")
    public ResponseEntity<?> getGroupMembers(
            @PathVariable Long groupId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            List<GroupMemberResponse> members = chatService.getGroupMembers(groupId, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", members
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ==================== MESSAGING ====================

    @PostMapping("/groups/{groupId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long groupId,
            @Valid @RequestBody SendMessageRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            ChatMessageResponse message = chatService.sendMessage(groupId, request, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", message
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/groups/{groupId}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            List<ChatMessageResponse> messages = chatService.getMessages(groupId, user, page, size);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", messages
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/groups/{groupId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long groupId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            chatService.markAsRead(groupId, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Marked as read"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Helper method
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