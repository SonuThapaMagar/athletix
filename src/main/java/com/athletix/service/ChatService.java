package com.athletix.service;

import com.athletix.dto.chat.*;
import com.athletix.dto.match.MatchRequestResponse;
import com.athletix.dto.match.UserBasicInfo;
import com.athletix.entity.*;
import com.athletix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatGroupRepository chatGroupRepository;
    private final ChatGroupMemberRepository chatGroupMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MatchRequestRepository matchRequestRepository;
    private final MatchRepository matchRepository;

    // ==================== GROUP MANAGEMENT ====================

    @Transactional
    public ChatGroupResponse createGroup(CreateGroupRequest request, User creator) {
        String inviteCode = generateInviteCode();

        ChatGroup group = ChatGroup.builder()
                .name(request.name())
                .description(request.description())
                .type(ChatGroup.GroupType.TEAM)
                .creator(creator)
                .inviteCode(inviteCode)
                .isActive(true)
                .build();

        group = chatGroupRepository.save(group);

        ChatGroupMember member = ChatGroupMember.builder()
                .group(group)
                .user(creator)
                .role(ChatGroupMember.MemberRole.ADMIN)
                .lastReadAt(LocalDateTime.now())
                .build();

        chatGroupMemberRepository.save(member);

        return toGroupResponse(group, creator);
    }

    @Transactional
    public ChatGroupResponse createDirectChat(Long userId1, Long userId2, User currentUser) {
        if (!currentUser.getUserId().equals(userId1)) {
            throw new RuntimeException("Unauthorized");
        }

        String inviteCode = generateInviteCode();

        ChatGroup group = ChatGroup.builder()
                .name("Direct Chat")
                .type(ChatGroup.GroupType.DIRECT)
                .creator(currentUser)
                .inviteCode(inviteCode)
                .isActive(true)
                .build();

        group = chatGroupRepository.save(group);

        chatGroupMemberRepository.save(ChatGroupMember.builder()
                .group(group)
                .user(currentUser)
                .role(ChatGroupMember.MemberRole.ADMIN)
                .build());

        return toGroupResponse(group, currentUser);
    }

    public List<ChatGroupResponse> getMyGroups(User user) {
        List<ChatGroup> groups = chatGroupRepository.findUserGroups(user);

        return groups.stream()
                .map(group -> toGroupResponse(group, user))
                .collect(Collectors.toList());
    }

    public ChatGroupResponse getGroupById(Long groupId, User user) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!chatGroupRepository.isUserMember(groupId, user.getUserId())) {
            throw new RuntimeException("You are not a member of this group");
        }

        return toGroupResponse(group, user);
    }

    @Transactional
    public ChatGroupResponse joinGroupByCode(String inviteCode, User user) {
        ChatGroup group = chatGroupRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        if (!group.getIsActive()) {
            throw new RuntimeException("This group is no longer active");
        }

        if (chatGroupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("You are already a member of this group");
        }

        ChatGroupMember member = ChatGroupMember.builder()
                .group(group)
                .user(user)
                .role(ChatGroupMember.MemberRole.MEMBER)
                .lastReadAt(LocalDateTime.now())
                .build();

        chatGroupMemberRepository.save(member);

        sendSystemMessage(group, user.getName() + " joined the group");

        return toGroupResponse(group, user);
    }

    public List<GroupMemberResponse> getGroupMembers(Long groupId, User user) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!chatGroupRepository.isUserMember(groupId, user.getUserId())) {
            throw new RuntimeException("You are not a member of this group");
        }

        return chatGroupMemberRepository.findByGroup(group).stream()
                .map(this::toMemberResponse)
                .collect(Collectors.toList());
    }

    // ==================== MESSAGING ====================

    @Transactional
    public ChatMessageResponse sendMessage(Long groupId, SendMessageRequest request, User sender) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!chatGroupRepository.isUserMember(groupId, sender.getUserId())) {
            throw new RuntimeException("You are not a member of this group");
        }

        ChatMessage message = ChatMessage.builder()
                .group(group)
                .sender(sender)
                .content(request.content())
                .type(ChatMessage.MessageType.TEXT)
                .isDeleted(false)
                .build();

        message = chatMessageRepository.save(message);

        ChatMessageResponse response = toMessageResponse(message);

        // Send via WebSocket to all group members
        messagingTemplate.convertAndSend("/topic/group/" + groupId, response);

        // Also send to match-specific topic if this is a match group
        if (group.getRelatedMatchId() != null) {
            messagingTemplate.convertAndSend("/topic/match/" + group.getRelatedMatchId() + "/chat", response);
        }

        return response;
    }

    public List<ChatMessageResponse> getMessages(Long groupId, User user, int page, int size) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!chatGroupRepository.isUserMember(groupId, user.getUserId())) {
            throw new RuntimeException("You are not a member of this group");
        }

        return chatMessageRepository
                .findByGroupOrderBySentAtDesc(group, PageRequest.of(page, size))
                .stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long groupId, User user) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        ChatGroupMember member = chatGroupMemberRepository.findByGroupAndUser(group, user)
                .orElseThrow(() -> new RuntimeException("Not a member"));

        member.setLastReadAt(LocalDateTime.now());
        chatGroupMemberRepository.save(member);
    }

    // ==================== MATCH GROUP MANAGEMENT ====================

    @Transactional
    public ChatGroup createOrAddToMatchGroup(Match match, User newPlayer) {
        // Check if group already exists
        ChatGroup group = chatGroupRepository.findByRelatedMatchId(match.getMatchId())
                .orElseGet(() -> {
                    // Create new group for this match
                    String inviteCode = generateInviteCode();

                    ChatGroup newGroup = ChatGroup.builder()
                            .name(match.getTitle() + " - Chat")
                            .description("Chat for match players")
                            .type(ChatGroup.GroupType.MATCH)
                            .creator(match.getCreator())
                            .inviteCode(inviteCode)
                            .relatedMatchId(match.getMatchId())
                            .isActive(true)
                            .build();

                    ChatGroup saved = chatGroupRepository.save(newGroup);

                    // Add match creator as admin
                    chatGroupMemberRepository.save(ChatGroupMember.builder()
                            .group(saved)
                            .user(match.getCreator())
                            .role(ChatGroupMember.MemberRole.ADMIN)
                            .build());

                    return saved;
                });

        // Add new player to group if not already a member
        if (!chatGroupMemberRepository.existsByGroupAndUser(group, newPlayer)) {
            chatGroupMemberRepository.save(ChatGroupMember.builder()
                    .group(group)
                    .user(newPlayer)
                    .role(ChatGroupMember.MemberRole.MEMBER)
                    .build());

            sendSystemMessage(group, newPlayer.getName() + " joined the match chat");
        }

        return group;
    }

    // ==================== HELPER METHODS ====================

    private void sendSystemMessage(ChatGroup group, String content) {
        ChatMessage systemMessage = ChatMessage.builder()
                .group(group)
                .sender(group.getCreator())
                .content(content)
                .type(ChatMessage.MessageType.SYSTEM)
                .isDeleted(false)
                .build();

        chatMessageRepository.save(systemMessage);

        messagingTemplate.convertAndSend(
                "/topic/group/" + group.getGroupId(),
                toMessageResponse(systemMessage)
        );

        // Also send to match-specific topic if applicable
        if (group.getRelatedMatchId() != null) {
            messagingTemplate.convertAndSend(
                    "/topic/match/" + group.getRelatedMatchId() + "/chat",
                    toMessageResponse(systemMessage)
            );
        }
    }

    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private ChatGroupResponse toGroupResponse(ChatGroup group, User currentUser) {
        int memberCount = chatGroupMemberRepository.findByGroup(group).size();

        ChatGroupMember member = chatGroupMemberRepository.findByGroupAndUser(group, currentUser)
                .orElse(null);

        Long unreadCount = 0L;
        if (member != null && member.getLastReadAt() != null) {
            unreadCount = chatMessageRepository.countUnreadMessages(
                    group.getGroupId(),
                    currentUser.getUserId(),
                    member.getLastReadAt()
            );
        }

        List<ChatMessage> lastMessages = chatMessageRepository.findByGroupOrderBySentAtDesc(
                group, PageRequest.of(0, 1)
        );
        ChatMessageResponse lastMessage = lastMessages.isEmpty() ? null : toMessageResponse(lastMessages.get(0));

        return new ChatGroupResponse(
                group.getGroupId(),
                group.getName(),
                group.getDescription(),
                group.getType().name(),
                group.getInviteCode(),
                toUserBasicInfo(group.getCreator()),
                memberCount,
                unreadCount,
                lastMessage,
                group.getCreatedAt()
        );
    }

    private MatchRequestResponse toMatchRequestResponse(MatchRequest matchRequest) {
        return new MatchRequestResponse(
                matchRequest.getRequestId(),
                matchRequest.getMatch().getMatchId(),
                toUserBasicInfo(matchRequest.getPlayer()),
                matchRequest.getMessage() != null ? matchRequest.getMessage() : "",
                matchRequest.getStatus().name(),
                matchRequest.getRequestedAt(),
                matchRequest.getRespondedAt()
        );
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getMessageId(),
                message.getSender().getUserId(),
                message.getSender().getName(),
                message.getContent(),
                message.getSentAt(),
                message.getGroup().getGroupId()
        );
    }

    private GroupMemberResponse toMemberResponse(ChatGroupMember member) {
        return new GroupMemberResponse(
                member.getId(),
                toUserBasicInfo(member.getUser()),
                member.getRole().name(),
                member.getJoinedAt()
        );
    }

    private UserBasicInfo toUserBasicInfo(User user) {
        return new UserBasicInfo(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getLocation()
        );
    }
}