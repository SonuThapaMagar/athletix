package com.athletix.dto.admin;

public record UserDto(
        Long id,
        String name,
        String email,
        String role,
        Boolean active
) {}