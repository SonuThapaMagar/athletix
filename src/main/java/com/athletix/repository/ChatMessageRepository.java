package com.athletix.repository;

import com.athletix.entity.ChatMessage;
import com.athletix.entity.ChatGroup;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("""
        SELECT m FROM ChatMessage m 
        WHERE m.group = :group AND m.isDeleted = false
        ORDER BY m.sentAt DESC
    """)
    List<ChatMessage> findByGroupOrderBySentAtDesc(@Param("group") ChatGroup group, Pageable pageable);

    @Query("""
        SELECT COUNT(m) FROM ChatMessage m 
        WHERE m.group.groupId = :groupId 
        AND m.sentAt > :lastReadAt 
        AND m.sender.userId != :userId
        AND m.isDeleted = false
    """)
    Long countUnreadMessages(
            @Param("groupId") Long groupId,
            @Param("userId") Long userId,
            @Param("lastReadAt") java.time.LocalDateTime lastReadAt
    );
}