package com.athletix.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", nullable = false, length = 500)
    private String location;

    @Column(nullable = false)
    private String sportType;

    @Column(nullable = false)
    private LocalDateTime matchDateTime;

    @Column(nullable = false)
    private Integer requiredPlayers;

    @Column(nullable = false)
    private Integer currentPlayers = 1; // Creator counts as 1

    private String skillLevel; // BEGINNER, INTERMEDIATE, ADVANCED, ANY

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.OPEN;

    private String contactInfo;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum MatchStatus {
        OPEN, CLOSED, CANCELLED, COMPLETED
    }

    // Helper methods
    public boolean isFull() {
        return currentPlayers >= requiredPlayers;
    }

    public void incrementPlayers() {
        this.currentPlayers++;
        if (isFull()) {
            this.status = MatchStatus.CLOSED;
        }
    }

    public void decrementPlayers() {
        if (this.currentPlayers > 1) {
            this.currentPlayers--;
            if (this.status == MatchStatus.CLOSED && !isFull()) {
                this.status = MatchStatus.OPEN;
            }
        }
    }
}