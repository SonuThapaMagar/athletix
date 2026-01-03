package com.athletix.dto.admin;

public record AdminUserDto(
        Long id,
        String name,
        String email,
        String phone,
        String location,
        String role,
        String status,
        Boolean active,
        String createdAt,
        String updatedAt,
        String avatar
) {}