package com.athletix.controller;

import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.dto.response.ApiResponse;
import com.athletix.dto.venue.VenueRequest;
import com.athletix.dto.venue.VenueResponse;
import com.athletix.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {
    private final VenueService venueService;

    // CREATE
    @PostMapping
    public ResponseEntity<VenueResponse> create(
            @RequestBody @Valid VenueRequest req,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(venueService.createVenue(req, authHeader));
    }

    // LIST ALL (for players) - now only approved
    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<VenueResponse>>> listAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int perPage
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Venues fetched successfully",
                        venueService.getAllVenues(page, perPage)
                )
        );
    }


    // VIEW ONE
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VenueResponse>> get(@PathVariable Long id) {
        VenueResponse venue = venueService.getVenueById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Venue fetched successfully",
                        venue
                )
        );
    }

    // MY VENUES (owner only)
    @GetMapping("/myVenues")
    public ResponseEntity<ApiResponse<PaginationResponse<VenueResponse>>> myVenues(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int perPage
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "My venues fetched successfully",
                        venueService.getMyVenues(authHeader, page, perPage)
                )
        );
    }



    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<VenueResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody VenueRequest req,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(venueService.updateVenue(id, req, authHeader));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        venueService.deleteVenue(id, authHeader);
        return ResponseEntity.ok("Venue deleted");
    }

    // search
//    @GetMapping("/search")
//    public ResponseEntity<List<VenueResponse>> search(
//            @RequestParam(required = false) String keyword,
//            @RequestParam(required = false) String sport) {
//        List<VenueResponse> results = venueService.searchVenues(keyword, sport);
//        return ResponseEntity.ok(results);
//    }

    // approve venue
//    @PutMapping("/approve/{id}")
//    public ResponseEntity<VenueResponse> approve(@PathVariable Long id) {
//        return ResponseEntity.ok(venueService.approveVenue(id, null)); // null for no logger
//    }
}