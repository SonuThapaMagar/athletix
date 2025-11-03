package com.athletix.controller;

import com.athletix.dto.user.UpdateProfileRequest;
import com.athletix.dto.user.UserResponse;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public UserController(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

//    @GetMapping("/myProfile")
//    public ResponseEntity<UserResponse> me(@RequestHeader("Authorization") String authHeader) {
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            throw new RuntimeException("Missing or invalid token");
//        }
//
//        String token = authHeader.substring(7);
//        String email = jwtUtil.extractEmail(token);
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (jwtUtil.isTokenExpired(token)) {
//            throw new RuntimeException("Token expired");
//        }
//
//        UserResponse res = new UserResponse(
//                user.getUserId().toString(),
//                user.getEmail(),
//                user.getName(),
//                user.getPhone(),
//                user.getRole()
//        );
//        return ResponseEntity.ok(res);
//    }

    @GetMapping("/myProfile")
    public ResponseEntity<UserResponse> me(@RequestHeader("Authorization") String authHeader) {
        User user = validateTokenAndGetUser(authHeader);
        return ResponseEntity.ok(toUserResponse(user));
    }

    // ------------------- UPDATE PROFILE -------------------
    @PutMapping("/updateProfile")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest req,
            @RequestHeader("Authorization") String authHeader) {

        User user = validateTokenAndGetUser(authHeader);

        // Optional: Prevent email change if you want
        if (!user.getEmail().equals(req.email()) && userRepository.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        user.setName(req.name());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        userRepository.save(user);

        return ResponseEntity.ok(toUserResponse(user));
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
                user.getRole()
        );
    }
}
