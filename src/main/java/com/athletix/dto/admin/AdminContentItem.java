package com.athletix.dto.admin;

public record AdminContentItem(
        Long id,
        String type,
        String author,
        String venue,
        Long venueId,
        String content,
        String reason,
        String reportedBy,
        String status,
        String reportedAt,
        String createdAt
) {}