package com.athletix.dto.match;

public record UserBasicInfo(
        Long userId,
        String name,
        String email,
        String phone,
        String location
) {}