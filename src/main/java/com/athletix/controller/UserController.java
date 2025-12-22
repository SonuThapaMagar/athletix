package com.athletix.controller;

import com.athletix.dto.user.UpdateProfileRequest;
import com.athletix.dto.user.UserResponse;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/myProfile")
    public ResponseEntity<?> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            User user = validateTokenAndGetUser(authHeader);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", toUserResponse(user)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/updateProfile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateProfileRequest req,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = validateTokenAndGetUser(authHeader);

            // ✅ Only update fields that are provided (not null and not empty)
            if (req.name() != null && !req.name().trim().isEmpty()) {
                user.setName(req.name().trim());
            }

//            if (req.email() != null && !req.email().trim().isEmpty()) {
//                // Check if email is being changed and if it's already taken
//                if (!user.getEmail().equals(req.email())) {
//                    if (userRepository.findByEmail(req.email()).isPresent()) {
//                        return ResponseEntity.badRequest()
//                                .body(Map.of("success", false, "message", "Email already in use"));
//                    }
//                    user.setEmail(req.email().trim());
//                }
//            }

            if (req.phone() != null) {
                user.setPhone(req.phone().trim());
            }

            if (req.location() != null) {
                user.setLocation(req.location().trim());
            }

            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Profile updated successfully",
                    "data", toUserResponse(user)
            ));
        } catch (Exception e) {
            e.printStackTrace();  // Log the error
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest req,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = validateTokenAndGetUser(authHeader);

            // Verify current password
            if (!passwordEncoder.matches(req.currentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Current password is incorrect"));
            }

            // Validate new password
            if (req.newPassword().length() < 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "New password must be at least 6 characters"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(req.newPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password changed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ------------------- HELPER METHODS -------------------
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

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getUserId().toString(),
                user.getEmail(),
                user.getName(),
                user.getPhone(),
                user.getLocation(),
                user.getRole()
        );
    }

    record ChangePasswordRequest(
            String currentPassword,
            String newPassword
    ) {}
}
