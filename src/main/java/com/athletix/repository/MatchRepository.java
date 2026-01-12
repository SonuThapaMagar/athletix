package com.athletix.repository;

import com.athletix.entity.Match;
import com.athletix.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    // Get all matches ordered by newest first
    Page<Match> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Get matches by status
    Page<Match> findByStatusOrderByCreatedAtDesc(Match.MatchStatus status, Pageable pageable);

    // Get my created matches
    Page<Match> findByCreatorOrderByCreatedAtDesc(User creator, Pageable pageable);

    // Filter matches with optional parameters
    @Query("""
    SELECT m FROM Match m WHERE\s
        (:sportType IS NULL OR m.sportType = CAST(:sportType AS string)) AND 
        (:location IS NULL OR m.location ILIKE CAST(:location AS string)) AND 
        (:skillLevel IS NULL OR m.skillLevel = CAST(:skillLevel AS string)) AND 
        (:status IS NULL OR m.status = :status) AND 
        (CAST(:startDate AS timestamp) IS NULL OR m.matchDateTime >= :startDate) AND 
        (CAST(:endDate AS timestamp) IS NULL OR m.matchDateTime <= :endDate) 
    ORDER BY m.createdAt DESC
""")
    Page<Match> findByFilters(
            @Param("sportType") String sportType,
            @Param("location") String location,
            @Param("skillLevel") String skillLevel,
            @Param("status") Match.MatchStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
}