package com.athletix.dto.user;

import com.athletix.entity.Role;

public record UserResponse(
        String userId,
        String email,
        String name,
        String phone,
        Role role
) {}
