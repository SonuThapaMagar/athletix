package com.athletix.service;

import com.athletix.dto.chat.ChatMessageResponse;
import com.athletix.dto.chat.SendMessageRequest;
import com.athletix.dto.match.*;
import com.athletix.entity.*;
import com.athletix.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchRequestRepository matchRequestRepository;
    private final ChatService chatService;
    private final ChatGroupRepository chatGroupRepository;
    private final ChatGroupMemberRepository chatGroupMemberRepository;

    // ==================== CHAT METHODS ====================

    public List<ChatMessageResponse> getChatMessages(Long matchId, User user, int page, int size) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // Find the chat group for this match
        ChatGroup group = chatGroupRepository.findByRelatedMatchId(matchId)
                .orElseThrow(() -> new RuntimeException("Chat group not found for this match"));

        // Check if user is a member of the chat group
        boolean isMember = chatGroupMemberRepository.existsByGroupAndUser(group, user);

        if (!isMember) {
            log.error("User {} is not a member of chat group {}", user.getUserId(), group.getGroupId());
            throw new RuntimeException("You are not a member of this chat group");
        }

        return chatService.getMessages(group.getGroupId(), user, page, size);
    }

    @Transactional
    public ChatMessageResponse sendChatMessage(Long matchId, SendMessageRequest request, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // Find the chat group
        ChatGroup group = chatGroupRepository.findByRelatedMatchId(matchId)
                .orElseThrow(() -> new RuntimeException("Chat group not found for this match"));

        // Check if user is a member
        boolean isMember = chatGroupMemberRepository.existsByGroupAndUser(group, user);

        if (!isMember) {
            log.error("User {} attempted to send message but is not a member of group {}",
                    user.getUserId(), group.getGroupId());
            throw new RuntimeException("You are not a member of this chat group");
        }

        return chatService.sendMessage(group.getGroupId(), request, user);
    }

    // ==================== MATCH CRUD ====================

    @Transactional
    public MatchResponse createMatch(CreateMatchRequest request, User creator) {
        Match match = new Match();
        match.setCreator(creator);
        match.setTitle(request.title());
        match.setDescription(request.description());
        match.setSportType(request.sportType());
        match.setLocation(request.location());
        match.setMatchDateTime(request.matchDateTime());
        match.setRequiredPlayers(request.requiredPlayers());
        match.setSkillLevel(request.skillLevel());
        match.setContactInfo(request.contactInfo());
        match.setAdditionalNotes(request.additionalNotes());
        match.setStatus(Match.MatchStatus.OPEN);
        match.setCurrentPlayers(1);

        match = matchRepository.save(match);

        // Create chat group and add creator as admin
        createMatchChatGroup(match, creator);

        log.info("Created match {} with chat group for creator {}", match.getMatchId(), creator.getUserId());

        return toMatchResponse(match, creator, null, null);
    }

    @Transactional
    public MatchResponse updateMatch(Long matchId, UpdateMatchRequest request, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (!match.getCreator().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Only match creator can update the match");
        }

        if (request.title() != null) match.setTitle(request.title());
        if (request.description() != null) match.setDescription(request.description());
        if (request.location() != null) match.setLocation(request.location());
        if (request.matchDateTime() != null) match.setMatchDateTime(request.matchDateTime());
        if (request.requiredPlayers() != null) {
            match.setRequiredPlayers(request.requiredPlayers());
            if (match.getCurrentPlayers() >= match.getRequiredPlayers()) {
                match.setStatus(Match.MatchStatus.CLOSED);
            } else if (match.getStatus() == Match.MatchStatus.CLOSED) {
                match.setStatus(Match.MatchStatus.OPEN);
            }
        }
        if (request.skillLevel() != null) match.setSkillLevel(request.skillLevel());
        if (request.contactInfo() != null) match.setContactInfo(request.contactInfo());
        if (request.additionalNotes() != null) match.setAdditionalNotes(request.additionalNotes());
        if (request.status() != null) {
            match.setStatus(Match.MatchStatus.valueOf(request.status().toUpperCase()));
        }

        match = matchRepository.save(match);
        return toMatchResponse(match, user, null, null);
    }

    @Transactional
    public void deleteMatch(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (!match.getCreator().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Only match creator can delete the match");
        }

        matchRepository.delete(match);
    }

    // ==================== REQUEST FLOW ====================

    @Transactional
    public MatchRequestResponse requestToJoin(Long matchId, JoinMatchRequest request, User player) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getCreator().getUserId().equals(player.getUserId())) {
            throw new RuntimeException("You cannot join your own match");
        }

        if (match.getStatus() != Match.MatchStatus.OPEN) {
            throw new RuntimeException("This match is not open for requests");
        }

        // Check for existing request
        matchRequestRepository.findByMatchAndPlayer(match, player).ifPresent(existingRequest -> {
            if (existingRequest.getStatus() == MatchRequest.RequestStatus.ACCEPTED) {
                throw new RuntimeException("You have already joined this match");
            }
            if (existingRequest.getStatus() == MatchRequest.RequestStatus.PENDING) {
                throw new RuntimeException("You have already requested to join this match");
            }
        });

        MatchRequest matchRequest = new MatchRequest();
        matchRequest.setMatch(match);
        matchRequest.setPlayer(player);
        matchRequest.setMessage(request.message());
        matchRequest.setStatus(MatchRequest.RequestStatus.PENDING);

        matchRequest = matchRequestRepository.save(matchRequest);

        log.info("Player {} requested to join match {}", player.getUserId(), matchId);

        return toMatchRequestResponse(matchRequest);
    }

    @Transactional
    public MatchRequestResponse respondToRequest(Long requestId, RespondToRequestRequest request, User user) {
        MatchRequest matchRequest = matchRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Match match = matchRequest.getMatch();

        if (!match.getCreator().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Only match creator can respond to requests");
        }

        if (matchRequest.getStatus() != MatchRequest.RequestStatus.PENDING) {
            throw new RuntimeException("This request has already been responded to");
        }

        if ("accept".equals(request.action())) {
            if (match.isFull()) {
                throw new RuntimeException("Match is already full");
            }

            // Accept the request
            matchRequest.setStatus(MatchRequest.RequestStatus.ACCEPTED);
            match.incrementPlayers();
            matchRepository.save(match);

            // Add player to chat group
            addPlayerToChatGroup(match, matchRequest.getPlayer());

            log.info("Player {} accepted to match {}. Added to chat group.",
                    matchRequest.getPlayer().getUserId(), match.getMatchId());

        } else {
            matchRequest.setStatus(MatchRequest.RequestStatus.REJECTED);
            log.info("Player {} rejected from match {}",
                    matchRequest.getPlayer().getUserId(), match.getMatchId());
        }

        matchRequest.setRespondedAt(LocalDateTime.now());
        matchRequest = matchRequestRepository.save(matchRequest);

        return toMatchRequestResponse(matchRequest);
    }

    // ==================== QUERY METHODS ====================

    public Page<MatchResponse> getMatches(
            String sportType,
            String location,
            String skillLevel,
            String status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size,
            User currentUser
    ) {
        Pageable pageable = PageRequest.of(page, size);
        String locationPattern = (location != null && !location.isEmpty()) ? "%" + location + "%" : null;
        Match.MatchStatus matchStatus = (status != null && !status.isEmpty())
                ? Match.MatchStatus.valueOf(status.toUpperCase()) : null;

        Page<Match> matches = matchRepository.findByFilters(
                sportType, locationPattern, skillLevel, matchStatus, startDate, endDate, pageable
        );

        return matches.map(match -> {
            MatchRequest userRequest = matchRequestRepository
                    .findByMatchAndPlayer(match, currentUser).orElse(null);
            Boolean hasRequested = userRequest != null;
            String requestStatus = userRequest != null ? userRequest.getStatus().name() : null;
            return toMatchResponse(match, currentUser, hasRequested, requestStatus);
        });
    }

    public Page<MatchResponse> getMyMatches(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return matchRepository.findByCreatorOrderByCreatedAtDesc(user, pageable)
                .map(match -> toMatchResponse(match, user, null, null));
    }

    public MatchResponse getMatchById(Long matchId, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        MatchRequest userRequest = matchRequestRepository
                .findByMatchAndPlayer(match, currentUser).orElse(null);
        Boolean hasRequested = userRequest != null;
        String requestStatus = userRequest != null ? userRequest.getStatus().name() : null;

        return toMatchResponse(match, currentUser, hasRequested, requestStatus);
    }

    public List<MatchRequestResponse> getMatchRequests(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (!match.getCreator().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Only match creator can view requests");
        }

        return matchRequestRepository.findByMatchOrderByRequestedAtDesc(match)
                .stream()
                .map(this::toMatchRequestResponse)
                .collect(Collectors.toList());
    }

    public List<AcceptedPlayerResponse> getAcceptedPlayers(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        boolean isHost = match.getCreator().getUserId().equals(user.getUserId());
        boolean isAcceptedPlayer = matchRequestRepository
                .findByMatchAndPlayer(match, user)
                .map(req -> req.getStatus() == MatchRequest.RequestStatus.ACCEPTED)
                .orElse(false);

        if (!isHost && !isAcceptedPlayer) {
            throw new RuntimeException("You don't have access to view accepted players");
        }

        List<MatchRequest> acceptedRequests = matchRequestRepository
                .findByMatchAndStatus(match, MatchRequest.RequestStatus.ACCEPTED);

        return acceptedRequests.stream()
                .map(req -> new AcceptedPlayerResponse(
                        req.getPlayer().getUserId(),
                        req.getPlayer().getName(),
                        req.getPlayer().getEmail(),
                        req.getPlayer().getPhone(),
                        req.getPlayer().getLocation(),
                        req.getRespondedAt()
                ))
                .collect(Collectors.toList());
    }

    public List<MatchRequestResponse> getMyRequests(User user) {
        return matchRequestRepository.findByPlayerOrderByRequestedAtDesc(user)
                .stream()
                .map(this::toMatchRequestResponse)
                .collect(Collectors.toList());
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Creates a chat group for a match and adds the creator as admin
     */
    @Transactional
    protected void createMatchChatGroup(Match match, User creator) {
        // Check if group already exists
        if (chatGroupRepository.findByRelatedMatchId(match.getMatchId()).isPresent()) {
            log.warn("Chat group already exists for match {}", match.getMatchId());
            return;
        }

        String inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        ChatGroup group = ChatGroup.builder()
                .name(match.getTitle() + " - Chat")
                .description("Chat for match: " + match.getTitle())
                .type(ChatGroup.GroupType.MATCH)
                .creator(creator)
                .inviteCode(inviteCode)
                .relatedMatchId(match.getMatchId())
                .isActive(true)
                .build();

        group = chatGroupRepository.save(group);

        // Add creator as admin member
        ChatGroupMember adminMember = ChatGroupMember.builder()
                .group(group)
                .user(creator)
                .role(ChatGroupMember.MemberRole.ADMIN)
                .lastReadAt(LocalDateTime.now())
                .build();

        chatGroupMemberRepository.save(adminMember);

        log.info("Created chat group {} for match {} with creator {} as admin",
                group.getGroupId(), match.getMatchId(), creator.getUserId());
    }

    /**
     * Adds an accepted player to the match chat group
     */
    @Transactional
    protected void addPlayerToChatGroup(Match match, User player) {
        ChatGroup group = chatGroupRepository.findByRelatedMatchId(match.getMatchId())
                .orElseThrow(() -> new RuntimeException("Chat group not found for this match"));

        // Check if player is already a member
        if (chatGroupMemberRepository.existsByGroupAndUser(group, player)) {
            log.warn("Player {} is already a member of chat group {}", player.getUserId(), group.getGroupId());
            return;
        }

        // Add player as regular member
        ChatGroupMember member = ChatGroupMember.builder()
                .group(group)
                .user(player)
                .role(ChatGroupMember.MemberRole.MEMBER)
                .lastReadAt(LocalDateTime.now())
                .build();

        chatGroupMemberRepository.save(member);

        log.info("Added player {} to chat group {} for match {}",
                player.getUserId(), group.getGroupId(), match.getMatchId());
    }

    // ==================== DTO CONVERTERS ====================

    private MatchResponse toMatchResponse(
            Match match,
            User currentUser,
            Boolean hasRequested,
            String requestStatus
    ) {
        Boolean isCreator = match.getCreator().getUserId().equals(currentUser.getUserId());

        // Get accepted players
        List<AcceptedPlayerResponse> acceptedPlayers = matchRequestRepository
                .findByMatchAndStatus(match, MatchRequest.RequestStatus.ACCEPTED)
                .stream()
                .map(req -> new AcceptedPlayerResponse(
                        req.getPlayer().getUserId(),
                        req.getPlayer().getName(),
                        req.getPlayer().getEmail(),
                        req.getPlayer().getPhone(),
                        req.getPlayer().getLocation(),
                        req.getRespondedAt()
                ))
                .collect(Collectors.toList());

        return new MatchResponse(
                match.getMatchId(),
                toUserBasicInfo(match.getCreator()),
                match.getTitle(),
                match.getDescription(),
                match.getSportType(),
                match.getLocation(),
                match.getMatchDateTime(),
                match.getRequiredPlayers(),
                match.getCurrentPlayers(),
                match.getSkillLevel(),
                match.getStatus().name(),
                match.getContactInfo(),
                match.getAdditionalNotes(),
                match.getCreatedAt(),
                match.getUpdatedAt(),
                isCreator,
                hasRequested,
                requestStatus,
                acceptedPlayers
        );
    }

    private MatchRequestResponse toMatchRequestResponse(MatchRequest request) {
        return new MatchRequestResponse(
                request.getRequestId(),
                request.getMatch().getMatchId(),
                toUserBasicInfo(request.getPlayer()),
                request.getMessage() != null ? request.getMessage() : "",
                request.getStatus().name(),
                request.getRequestedAt(),
                request.getRespondedAt()
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