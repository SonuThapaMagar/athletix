package com.athletix.service;

import com.athletix.dto.booking.BookingResponse;
import com.athletix.dto.pagination.Pagination;
import com.athletix.dto.pagination.PaginationResponse;
import com.athletix.entity.Booking;
import com.athletix.entity.User;
import com.athletix.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueOwnerBookingService {

    private final BookingRepository bookingRepository;
    private final AuthService authService;

    // VIEW BOOKINGS FOR MY VENUE
    public PaginationResponse<BookingResponse> getMyVenueBookings(
            String authHeader,
            Integer page,
            Integer perPage) {

        User owner = authService.validateVenueOwner(authHeader);

        // Default pagination values
        int pageIndex = Math.max((page != null ? page : 1) - 1, 0);
        int size = (perPage != null && perPage > 0) ? perPage : 10;

        // Create pageable with sorting by createdAt descending
        var pageable = PageRequest.of(pageIndex, size, Sort.by("createdAt").descending());

        // Fetch paginated bookings
        Page<Booking> bookingPage = bookingRepository.findByVenueOwnerUserId(
                owner.getUserId(),
                pageable
        );

        // Map to response DTOs
        List<BookingResponse> bookingResponses = bookingPage.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        // Create pagination metadata
        Pagination pagination = new Pagination(
                page != null ? page : 1,
                size,
                bookingPage.getTotalElements(),
                bookingPage.getTotalPages()
        );

        return new PaginationResponse<>(bookingResponses, pagination);
    }

    private BookingResponse toResponse(com.athletix.entity.Booking b) {
        String venueImage = null;

        if (b.getVenue().getImages() != null && !b.getVenue().getImages().isEmpty()) {
            venueImage = b.getVenue().getImages().get(0);
        }
        return new BookingResponse(
                b.getId(),
                b.getVenue().getId(),
                b.getVenue().getName(),
                venueImage,
                b.getPlayer().getUserId(),
                b.getPlayer().getName(),
                b.getStartTime(),
                b.getEndTime(),
                b.getAmount(),
                b.getSportType(),
                b.getStatus(),
                b.isPaid(),
                b.getCreatedAt()
        );
    }
}