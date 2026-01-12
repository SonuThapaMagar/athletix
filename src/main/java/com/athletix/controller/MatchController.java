package com.athletix.controller;

import com.athletix.dto.match.*;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import com.athletix.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/player/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // Get all matches (with filters)
    @GetMapping
    public ResponseEntity<?> getMatches(
            @RequestParam(required = false) String sportType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skillLevel,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            Page<MatchResponse> matches = matchService.getMatches(
                    sportType, location, skillLevel, status, startDate, endDate, page, size, user
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", matches.getContent(),
                    "pagination", Map.of(
                            "currentPage", matches.getNumber(),
                            "totalPages", matches.getTotalPages(),
                            "totalItems", matches.getTotalElements(),
                            "pageSize", matches.getSize()
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Get my created matches
    @GetMapping("/my")
    public ResponseEntity<?> getMyMatches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            Page<MatchResponse> matches = matchService.getMyMatches(user, page, size);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", matches.getContent(),
                    "pagination", Map.of(
                            "currentPage", matches.getNumber(),
                            "totalPages", matches.getTotalPages(),
                            "totalItems", matches.getTotalElements(),
                            "pageSize", matches.getSize()
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Get match by ID
    @GetMapping("/{matchId}")
    public ResponseEntity<?> getMatchById(
            @PathVariable Long matchId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            MatchResponse match = matchService.getMatchById(matchId, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", match
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Create match
    @PostMapping
    public ResponseEntity<?> createMatch(
            @Valid @RequestBody CreateMatchRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            MatchResponse match = matchService.createMatch(request, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Match created successfully",
                    "data", match
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Update match
    @PutMapping("/{matchId}")
    public ResponseEntity<?> updateMatch(
            @PathVariable Long matchId,
            @Valid @RequestBody UpdateMatchRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            MatchResponse match = matchService.updateMatch(matchId, request, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Match updated successfully",
                    "data", match
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Delete match
    @DeleteMapping("/{matchId}")
    public ResponseEntity<?> deleteMatch(
            @PathVariable Long matchId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            matchService.deleteMatch(matchId, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Match deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Request to join match
    @PostMapping("/{matchId}/request")
    public ResponseEntity<?> requestToJoin(
            @PathVariable Long matchId,
            @Valid @RequestBody JoinMatchRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            MatchRequestResponse matchRequest = matchService.requestToJoin(matchId, request, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Join request sent successfully",
                    "data", matchRequest
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Get match requests (for match creator)
    @GetMapping("/{matchId}/requests")
    public ResponseEntity<?> getMatchRequests(
            @PathVariable Long matchId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            List<MatchRequestResponse> requests = matchService.getMatchRequests(matchId, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", requests
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Respond to join request
    @PutMapping("/requests/{requestId}")
    public ResponseEntity<?> respondToRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody RespondToRequestRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            MatchRequestResponse matchRequest = matchService.respondToRequest(requestId, request, user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Request " + request.action() + "ed successfully",
                    "data", matchRequest
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

//    // Get chat messages
//    @GetMapping("/{matchId}/chat")
//    public ResponseEntity<?> getChatMessages(
//            @PathVariable Long matchId,
//            @RequestHeader("Authorization") String authHeader
//    ) {
//        try {
//            User user = validateTokenAndGetUser(authHeader);
//            List<ChatMessageResponse> messages = matchService.getChatMessages(matchId, user);
//
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "data", messages
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("success", false, "message", e.getMessage()));
//        }
//    }
//
//    // Send chat message
//    @PostMapping("/{matchId}/chat")
//    public ResponseEntity<?> sendChatMessage(
//            @PathVariable Long matchId,
//            @Valid @RequestBody SendChatMessageRequest request,
//            @RequestHeader("Authorization") String authHeader
//    ) {
//        try {
//            User user = validateTokenAndGetUser(authHeader);
//            ChatMessageResponse message = matchService.sendChatMessage(matchId, request, user);
//
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "Message sent successfully",
//                    "data", message
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("success", false, "message", e.getMessage()));
//        }
//    }

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