package com.athletix.repository;

import com.athletix.entity.ChatGroup;
import com.athletix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {

    Optional<ChatGroup> findByInviteCode(String inviteCode);

    Optional<ChatGroup> findByRelatedMatchId(Long matchId);

    @Query("""
        SELECT DISTINCT g FROM ChatGroup g 
        JOIN g.members m 
        WHERE m.user = :user AND g.isActive = true
        ORDER BY g.createdAt DESC
    """)
    List<ChatGroup> findUserGroups(@Param("user") User user);

    @Query("""
        SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
        FROM ChatGroupMember m
        WHERE m.group.groupId = :groupId AND m.user.userId = :userId
    """)
    boolean isUserMember(@Param("groupId") Long groupId, @Param("userId") Long userId);
}