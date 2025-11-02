package com.athletix.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {}
