package com.athletix.dto.auth;

import com.athletix.entity.Role;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        Role userRole
) {}
