package com.athletix.dto.match;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long chatId,
        Long matchId,
        UserBasicInfo user,
        String message,
        LocalDateTime sentAt
) {}