package com.athletix.dto.admin;

public record AdminRecentActivity(
        Long id,
        String action,
        String user,
        String time,
        String type,
        Long relatedEntityId,
        String relatedEntityType
) {}