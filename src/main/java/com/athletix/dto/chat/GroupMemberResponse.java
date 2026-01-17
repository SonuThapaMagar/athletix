package com.athletix.dto.chat;

import com.athletix.dto.match.UserBasicInfo;

import java.time.LocalDateTime;

public record GroupMemberResponse(
        Long memberId,
        UserBasicInfo user,
        String role,
        LocalDateTime joinedAt
) {}