package com.athletix.dto.admin;

public record AdminActivityLog(
        Long id,
        String user,
        Long userId,
        String action,
        String venue,
        Long venueId,
        String time,
        String type,
        java.util.Map<String, Object> metadata
) {}
