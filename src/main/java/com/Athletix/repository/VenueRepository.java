package com.athletix.repository;

import com.athletix.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByOwner_UserId(Long ownerId);
}
