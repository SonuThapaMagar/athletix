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
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

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
                .role(role)
                .build();

        return userRepository.save(user);
    }

    // --- LOGIN (return both tokens) ---
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

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse refresh(String refreshToken) {
        RefreshToken rt = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (rt.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(rt);
            throw new RuntimeException("Refresh token expired");
        }

        User user = rt.getUser();
        String newAccessToken = jwtUtil.generateToken(user);
        return new AuthResponse(newAccessToken, refreshToken);
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

}
