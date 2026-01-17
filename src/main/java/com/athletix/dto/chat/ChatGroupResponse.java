package com.athletix.dto.chat;

import com.athletix.dto.match.UserBasicInfo;

import java.time.LocalDateTime;
import java.util.List;

public record ChatGroupResponse(
        Long groupId,
        String name,
        String description,
        String type,
        String inviteCode,
        UserBasicInfo creator,
        Integer memberCount,
        Long unreadCount,
        ChatMessageResponse lastMessage,
        LocalDateTime createdAt
) {}