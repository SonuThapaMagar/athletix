package com.athletix.service;

import com.athletix.dto.auth.AuthResponse;
import com.athletix.dto.auth.LoginRequest;
import com.athletix.dto.auth.RegisterRequest;
import com.athletix.entity.RefreshToken;
import com.athletix.entity.Role;
import com.athletix.entity.User;
import com.athletix.repository.RefreshTokenRepository;
import com.athletix.repository.UserRepository;
import com.athletix.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    public final UserRepository userRepository;
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

    // ---------- REFRESH TOKEN ----------
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

    // ---------- LOGOUT ----------
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    // ---------- PASSWORD RESET WITH OTP ----------
    @Transactional
    public void sendPasswordResetOTP(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Set OTP and expiry (10 minutes from now)
        user.setResetToken(otp);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP via email
        String emailBody = String.format(
                "Your password reset OTP is: %s\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.",
                otp
        );

        emailService.sendEmail(
                user.getEmail(),
                "Password Reset OTP - Athletix",
                emailBody
        );
    }

    @Transactional
    public void resetPasswordWithOTP(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if OTP matches
        if (user.getResetToken() == null || !user.getResetToken().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check if OTP has expired
        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        // Reset password and clear OTP
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    // ---------- CHANGE PASSWORD ----------
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

    // ---------- USER VALIDATION ----------
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