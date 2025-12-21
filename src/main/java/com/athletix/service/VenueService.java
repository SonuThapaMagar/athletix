package com.athletix.service;

import com.athletix.dto.pagination.Pagination;
import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.dto.venue.OperatingHour;
import com.athletix.dto.venue.VenueRequest;
import com.athletix.dto.venue.VenueResponse;
import com.athletix.entity.OperatingHourEmbed;
import com.athletix.entity.User;
import com.athletix.entity.Venue;
import com.athletix.repository.UserRepository;
import com.athletix.repository.VenueRepository;
import com.athletix.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
        // Step 1: Extract owner from token (or skip for testing)
        User owner = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                if (!jwtUtil.isTokenExpired(token)) {
                    String email = jwtUtil.extractEmail(token);
                    owner = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("Owner not found via token"));
                }
            } catch (Exception e) {
                throw new RuntimeException("Invalid token: " + e.getMessage());
            }
        } else {
            // TEMP: For testing without token—use super admin or throw
            owner = userRepository.findByEmail("admin@athletix.com")
                    .orElseThrow(() -> new RuntimeException("No token; use admin for testing"));
        }

        // Step 2: Map DTO to Entity
        Venue venue = Venue.builder()
                .owner(owner)
                .name(req.name())
                .location(req.location())
                .sportTypes(req.sports())
                .pricePerHour(req.pricePerHour())
                .description(req.description())
                .images(req.images())
                .amenities(req.amenities())
                .contactPhone(req.phone())
                .contactEmail(req.email())
                .operatingHours(mapToEmbeddable(req.operatingHours()))  // Map nested
//                .status(com.athletix.dto.admin.VenueStatus.PENDING)  // Default
//                .isVerified(false)
                .build();

        // Step 3: Save & Map Response
        Venue saved = venueRepository.save(venue);
        return toVenueResponse(saved, owner.getName());
    }

    // ... Other methods (getAll, getById, etc.)
//    public List<VenueResponse> getAllVenues() {
//        return venueRepository.findAll().stream()
//                .map(v -> toVenueResponse(v, v.getOwner().getName()))
//                .filter(v -> v.isVerified())  // Only approved
//                .collect(Collectors.toList());
//    }

    public PaginationResponse<VenueResponse> getAllVenues(int page, int perPage) {
        int pageIndex = Math.max(page - 1, 0);
        var pageable = PageRequest.of(pageIndex, perPage);

        // ❌ REMOVE approval filter
        Page<Venue> venuePage = venueRepository.findAll(pageable);

        List<VenueResponse> venueResponses = venuePage.getContent().stream()
                .map(v -> toVenueResponse(v, v.getOwner().getName()))
                .collect(Collectors.toList());

        var pagination = new Pagination(
                page,
                perPage,
                venuePage.getTotalElements(),
                Math.max(venuePage.getTotalPages(), 1)
        );

        return new PaginationResponse<>(venueResponses, pagination);
    }


    public VenueResponse getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        return toVenueResponse(venue, venue.getOwner().getName());
    }

    public PaginationResponse<VenueResponse> getMyVenues(String authHeader, int page, int perPage) {
        User owner = extractOwnerFromHeader(authHeader);
        int pageIndex = Math.max(page - 1, 0);
        var pageable = PageRequest.of(pageIndex, perPage);
        // Assumes VenueRepository has: Page<Venue> findByOwnerUserId(Long userId, Pageable pageable);
        Page<Venue> venuePage = venueRepository.findByOwner_UserId(owner.getUserId(), pageable);
        List<VenueResponse> venueResponses = venuePage.getContent().stream()
                .map(v -> toVenueResponse(v, owner.getName()))
                .collect(Collectors.toList());
        var pagination = new Pagination(page, perPage, venuePage.getTotalElements(), venuePage.getTotalPages());
        return new PaginationResponse<>(venueResponses, pagination);
    }

    public VenueResponse updateVenue(Long id, VenueRequest req, String authHeader) {
        User owner = extractOwnerFromHeader(authHeader);
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        if (!venue.getOwner().equals(owner)) {
            throw new RuntimeException("Not authorized to update this venue");
        }
        // Update fields
        venue.setName(req.name());
        venue.setLocation(req.location());
        venue.setSportTypes(req.sports());
        venue.setPricePerHour(req.pricePerHour());
        venue.setDescription(req.description());
        venue.setImages(req.images()); // overwrite images list
        venue.setAmenities(req.amenities());
        venue.setContactPhone(req.phone());
        venue.setContactEmail(req.email());
        venue.setOperatingHours(mapToEmbeddable(req.operatingHours()));

        Venue updated = venueRepository.save(venue);

        return toVenueResponse(updated, owner.getName());
    }

    public void deleteVenue(Long id, String authHeader) {
        User owner = extractOwnerFromHeader(authHeader);

        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getOwner().equals(owner)) {
            throw new RuntimeException("Not authorized to delete this venue");
        }

        venueRepository.delete(venue);
    }

//    public VenueResponse approveVenue(Long id, String loggerEmail) {  // Admin use
//        Venue venue = venueRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Venue not found"));
////        venue.setStatus(com.athletix.dto.admin.VenueStatus.APPROVED);
//        venue.setVerified(true);
//        venueRepository.save(venue);
//        return toVenueResponse(venue, venue.getOwner().getName());
//    }

    // Helpers
    private User extractOwnerFromHeader(String authHeader) {
        // Similar to create, but throw if no token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = authHeader.substring(7);
        if (jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("Token expired");
        }
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private List<OperatingHourEmbed> mapToEmbeddable(List<OperatingHour> dtoHours) {
        if (dtoHours == null) return List.of();
        return dtoHours.stream()
                .map(h -> new OperatingHourEmbed(h.day(), h.openTime(), h.closeTime()))
                .collect(Collectors.toList());
    }

    // NEW: Map embed back to DTO list for response
    private List<OperatingHour> mapToDtoHours(List<OperatingHourEmbed> embedHours) {
        if (embedHours == null) return List.of();
        return embedHours.stream()
                .map(h -> new OperatingHour(h.getDay(), h.getOpenTime(), h.getCloseTime()))
                .collect(Collectors.toList());
    }

    private VenueResponse toVenueResponse(Venue v, String ownerName) {
        return new VenueResponse(
                v.getId(),
                v.getName(),
                v.getLocation(),  // Now won't be null if sent
                v.getSportTypes(),
                v.getPricePerHour(),
                v.getDescription(),
                v.getImages(),
                v.getAmenities(),
                mapToDtoHours(v.getOperatingHours()),  // ← Add this!
                v.getContactPhone(),  // ← Add
                v.getContactEmail(),  // ← Add
                v.getOwner().getUserId(),
                ownerName,
//                v.isVerified(),
                v.getCreatedAt(),
                v.getUpdatedAt()
        );
    }
}