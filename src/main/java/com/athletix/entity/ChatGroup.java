package com.athletix.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupType type; // DIRECT, TEAM, MATCH

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(unique = true, nullable = false)
    private String inviteCode; // For joining via link

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // For match-specific groups
    private Long relatedMatchId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ChatGroupMember> members = new ArrayList<>();

    public enum GroupType {
        DIRECT,  // 1-on-1 chat
        TEAM,    // Team/group created by users
        MATCH    // Auto-created for accepted match players
    }
}