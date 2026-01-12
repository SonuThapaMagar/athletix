package com.athletix.repository;

import com.athletix.entity.Match;
import com.athletix.entity.MatchRequest;
import com.athletix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRequestRepository extends JpaRepository<MatchRequest, Long> {

    // Find all requests for a match
    List<MatchRequest> findByMatchOrderByRequestedAtDesc(Match match);

    // Find all requests by a player
    List<MatchRequest> findByPlayerOrderByRequestedAtDesc(User player);

    // Find specific request
    Optional<MatchRequest> findByMatchAndPlayer(Match match, User player);

    // Check if request exists
    boolean existsByMatchAndPlayer(Match match, User player);

    // Find by status
    List<MatchRequest> findByMatchAndStatus(Match match, MatchRequest.RequestStatus status);
}