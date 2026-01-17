package com.athletix.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_group_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatGroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private ChatGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MemberRole role = MemberRole.MEMBER;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    private LocalDateTime lastReadAt;

    public enum MemberRole {
        ADMIN,   // Group creator
        MEMBER   // Regular member
    }
}