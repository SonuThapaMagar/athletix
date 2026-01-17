package com.athletix.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private Long id;           // messageId
    private Long senderId;     // sender's userId
    private String senderName; // sender's name
    private String message;    // content
    private LocalDateTime timestamp; // sentAt
    private Long groupId;      // groupId (optional, for context)
}