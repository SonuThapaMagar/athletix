package com.athletix.service;

import com.athletix.dto.auth.AuthResponse;
import com.athletix.dto.auth.LoginRequest;
import com.athletix.dto.auth.RegisterRequest;
import com.athletix.dto.user.UserResponse;
import com.athletix.entity.RefreshToken;
import com.athletix.entity.Role;
import com.athletix.entity.User;
import com.athletix.repository.RefreshTokenRepository;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailService emailService;

    // ---------- REGISTER ----------
    @Transactional
    public User register(RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Role role = req.role() != null ? req.role() : Role.PLAYER;

        User user = User.builder()
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .name(req.name())
                .phone(req.phone())
                .location(req.location())
                .role(role)
                .build();

        return userRepository.save(user);
    }

    // ---------- LOGIN ----------
    @Transactional
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        RefreshToken rt = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiryDate(Instant.now().plusMillis(1000L * 60 * 60 * 24 * 7))
                .build();
        refreshTokenRepository.save(rt);

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getRole()
        );
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        RefreshToken rt = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (rt.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(rt);
            throw new RuntimeException("Refresh token expired");
        }

        User user = rt.getUser();
        String newAccessToken = jwtUtil.generateToken(user);

        return new AuthResponse(
                newAccessToken,
                refreshToken,
                user.getRole()
        );
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    @Transactional
    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendEmail(
                user.getEmail(),
                "Reset your password",
                "Click the link to reset your password: " + resetLink
        );
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(String authHeader, String oldPassword, String newPassword) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid token");
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User validateUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }
        String token = authHeader.substring(7);
        if (jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("Token expired");
        }
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User validateVenueOwner(String authHeader) {
        User user = validateUser(authHeader);
        if (user.getRole() != Role.VENUE_OWNER) {
            throw new RuntimeException("Only venue owners allowed");
        }
        return user;
    }

    public User validatePlayer(String authHeader) {
        User user = validateUser(authHeader);
        if (user.getRole() != Role.PLAYER) {
            throw new RuntimeException("Only players allowed");
        }
        return user;
    }
}
