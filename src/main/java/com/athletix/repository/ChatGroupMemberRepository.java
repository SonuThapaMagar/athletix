package com.athletix.repository;

import com.athletix.entity.ChatGroupMember;
import com.athletix.entity.ChatGroup;
import com.athletix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatGroupMemberRepository extends JpaRepository<ChatGroupMember, Long> {

    List<ChatGroupMember> findByGroup(ChatGroup group);

    Optional<ChatGroupMember> findByGroupAndUser(ChatGroup group, User user);

    boolean existsByGroupAndUser(ChatGroup group, User user);
}