package com.athletix.controller;

import com.athletix.dto.user.UserResponse;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public UserController(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @GetMapping("/userList")
    public ResponseEntity<UserResponse> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("Token expired");
        }

        UserResponse res = new UserResponse(
                user.getUserId().toString(),
                user.getEmail(),
                user.getName(),
                user.getPhone(),
                user.getRole()
        );
        return ResponseEntity.ok(res);
    }
}
