package com.athletix.repository;

import com.athletix.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface VenueRepository extends JpaRepository<Venue, Long> {

    @Query("""
        SELECT DISTINCT v FROM Venue v
        WHERE 
            (:keyword IS NULL OR 
                LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(v.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                EXISTS (SELECT 1 FROM v.sportTypes st 
                        WHERE LOWER(st) LIKE LOWER(CONCAT('%', :keyword, '%'))))
        AND 
            (:sport IS NULL OR 
                EXISTS (SELECT 1 FROM v.sportTypes st2 
                        WHERE LOWER(st2) LIKE LOWER(CONCAT('%', :sport, '%'))))
       
        """)
    List<Venue> searchVenues(@Param("keyword") String keyword,
                             @Param("sport") String sport);

    List<Venue> findByOwner_UserId(Long ownerId);
    Page<Venue> findByOwner_UserId(Long ownerId, Pageable pageable);
    Page<Venue> findByIsVerifiedTrue(Pageable pageable);
}
