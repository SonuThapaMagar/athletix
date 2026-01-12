package com.athletix.service;

import com.athletix.dto.match.*;
import com.athletix.entity.Match;
import com.athletix.entity.MatchRequest;
//import com.athletix.entity.MatchChat;
import com.athletix.entity.User;
import com.athletix.repository.MatchRepository;
import com.athletix.repository.MatchRequestRepository;
//import com.athletix.repository.MatchChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchRequestRepository matchRequestRepository;
//    private final MatchChatRepository matchChatRepository;

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
        return toMatchResponse(match, creator, null, null);
    }

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

        // 1. Prepare the location parameter for the ILIKE query
        String locationPattern = (location != null && !location.isEmpty())
                ? "%" + location + "%"
                : null;

        // 2. Convert status string to enum
        Match.MatchStatus matchStatus = (status != null && !status.isEmpty())
                ? Match.MatchStatus.valueOf(status.toUpperCase())
                : null;

        // 3. Call repository with the pattern
        Page<Match> matches = matchRepository.findByFilters(
                sportType,
                locationPattern, // Pass the formatted pattern here
                skillLevel,
                matchStatus,
                startDate,
                endDate,
                pageable
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

        if (matchRequestRepository.existsByMatchAndPlayer(match, player)) {
            throw new RuntimeException("You have already requested to join this match");
        }

        MatchRequest matchRequest = new MatchRequest();
        matchRequest.setMatch(match);
        matchRequest.setPlayer(player);
        matchRequest.setMessage(request.message());
        matchRequest.setStatus(MatchRequest.RequestStatus.PENDING);

        matchRequest = matchRequestRepository.save(matchRequest);

        return toMatchRequestResponse(matchRequest);
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

    @Transactional
    public MatchRequestResponse respondToRequest(
            Long requestId,
            RespondToRequestRequest request,
            User user
    ) {
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
            matchRequest.setStatus(MatchRequest.RequestStatus.ACCEPTED);
            match.incrementPlayers();
            matchRepository.save(match);
        } else {
            matchRequest.setStatus(MatchRequest.RequestStatus.REJECTED);
        }

        matchRequest.setRespondedAt(LocalDateTime.now());
        matchRequest = matchRequestRepository.save(matchRequest);

        return toMatchRequestResponse(matchRequest);
    }

//    public List<ChatMessageResponse> getChatMessages(Long matchId, User user) {
//        Match match = matchRepository.findById(matchId)
//                .orElseThrow(() -> new RuntimeException("Match not found"));
//
//        boolean isCreator = match.getCreator().getUserId().equals(user.getUserId());
//        boolean isAcceptedMember = matchRequestRepository
//                .findByMatchAndPlayer(match, user)
//                .map(req -> req.getStatus() == MatchRequest.RequestStatus.ACCEPTED)
//                .orElse(false);
//
//        if (!isCreator && !isAcceptedMember) {
//            throw new RuntimeException("You don't have access to this chat");
//        }
//
//        return matchChatRepository.findByMatchOrderBySentAtAsc(match)
//                .stream()
//                .map(this::toChatMessageResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public ChatMessageResponse sendChatMessage(
//            Long matchId,
//            SendChatMessageRequest request,
//            User user
//    ) {
//        Match match = matchRepository.findById(matchId)
//                .orElseThrow(() -> new RuntimeException("Match not found"));
//
//        boolean isCreator = match.getCreator().getUserId().equals(user.getUserId());
//        boolean isAcceptedMember = matchRequestRepository
//                .findByMatchAndPlayer(match, user)
//                .map(req -> req.getStatus() == MatchRequest.RequestStatus.ACCEPTED)
//                .orElse(false);
//
//        if (!isCreator && !isAcceptedMember) {
//            throw new RuntimeException("You don't have access to this chat");
//        }
//
//        MatchChat chat = new MatchChat();
//        chat.setMatch(match);
//        chat.setUser(user);
//        chat.setMessage(request.message());
//
//        chat = matchChatRepository.save(chat);
//
//        return toChatMessageResponse(chat);
//    }

    private MatchResponse toMatchResponse(
            Match match,
            User currentUser,
            Boolean hasRequested,
            String requestStatus
    ) {
        Boolean isCreator = match.getCreator().getUserId().equals(currentUser.getUserId());

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
                requestStatus
        );
    }

    private MatchRequestResponse toMatchRequestResponse(MatchRequest request) {
        return new MatchRequestResponse(
                request.getRequestId(),
                request.getMatch().getMatchId(),
                toUserBasicInfo(request.getPlayer()),
                request.getMessage(),
                request.getStatus().name(),
                request.getRequestedAt(),
                request.getRespondedAt()
        );
    }

//    private ChatMessageResponse toChatMessageResponse(MatchChat chat) {
//        return new ChatMessageResponse(
//                chat.getChatId(),
//                chat.getMatch().getMatchId(),
//                toUserBasicInfo(chat.getUser()),
//                chat.getMessage(),
//                chat.getSentAt()
//        );
//    }

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