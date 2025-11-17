package com.athletix.repository;

import com.athletix.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByOwner_UserId(Long ownerId);
}
