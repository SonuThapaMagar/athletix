package com.athletix.service;

import com.athletix.dto.venue.VenueRequest;
import com.athletix.dto.venue.VenueResponse;
import com.athletix.entity.Role;
import com.athletix.entity.User;
import com.athletix.entity.Venue;
import com.athletix.repository.UserRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueService {
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public VenueResponse createVenue(VenueRequest req, String authHeader) {
        User owner = validateOwner(authHeader);

        Venue venue = new Venue();
        venue.setOwner(owner);
        venue.setName(req.name());
        venue.setAddress(req.address());
        venue.setCity(req.city());
        venue.setSportTypes(req.sportTypes());
        venue.setPricePerHour(req.pricePerHour());
        venue.setDescription(req.description());
        venue.setImages(req.images() != null ? req.images() : List.of());

        venueRepository.save(venue);
        return toResponse(venue);
    }

    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public VenueResponse getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        return toResponse(venue);
    }

    public List<VenueResponse> getMyVenues(String authHeader) {
        User owner = validateOwner(authHeader);
        return venueRepository.findByOwner_UserId(owner.getUserId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public VenueResponse updateVenue(Long id, VenueRequest req, String authHeader) {
        User owner = validateOwner(authHeader);
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
            throw new RuntimeException("You can only update your own venue");
        }

        venue.setName(req.name());
        venue.setAddress(req.address());
        venue.setCity(req.city());
        venue.setSportTypes(req.sportTypes());
        venue.setPricePerHour(req.pricePerHour());
        venue.setDescription(req.description());
        venue.setImages(req.images() != null ? req.images() : venue.getImages());

        venueRepository.save(venue);
        return toResponse(venue);
    }

    public void deleteVenue(Long id, String authHeader) {
        User owner = validateOwner(authHeader);
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getOwner().getUserId().equals(owner.getUserId())) {
            throw new RuntimeException("You can only delete your own venue");
        }

        venueRepository.delete(venue);
    }

    private User validateOwner(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }
        String token = authHeader.substring(7);
        if (jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("Token expired");
        }
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.VENUE_OWNER) {
            throw new RuntimeException("Only venue owners can manage venues");
        }
        return user;
    }

    private VenueResponse toResponse(Venue v) {
        return new VenueResponse(
                v.getId(),
                v.getName(),
                v.getAddress(),
                v.getCity(),
                v.getSportTypes(),
                v.getPricePerHour(),
                v.getDescription(),
                v.getImages(),
                v.getOwner().getUserId(),
                v.getOwner().getName(),
                v.isVerified(),
                v.getCreatedAt(),
                v.getUpdatedAt()
        );
    }

}
